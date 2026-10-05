// Download source JPEG bytes, never resize/recompress. Keep existing cover on failure.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { promisify } = require('node:util');
const run = promisify(require('node:child_process').execFile);
const root = path.resolve(__dirname, '..', 'dist');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/official-cover-cache.js'), 'utf8'), context);
const mapping = context.window.IU_OFFICIAL_COVERS;
function dimensions(buffer) {
  let at = 2;
  while (at + 9 < buffer.length) {
    if (buffer[at++] !== 255) continue;
    const marker = buffer[at++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(at);
    if ([0xc0,0xc1,0xc2].includes(marker)) return { width: buffer.readUInt16BE(at + 5), height: buffer.readUInt16BE(at + 3) };
    if (length < 2) break;
    at += length;
  }
  return { width: 0, height: 0 };
}
const entries = Object.entries(mapping), audit = []; let cursor = 0;
async function worker() {
  while (cursor < entries.length) {
    const [source, local] = entries[cursor++];
    const file = path.join(root, local), candidate = file + '.download';
    const before = dimensions(fs.readFileSync(file));
    let result = { source, local, before, after: before, upgraded: false };
    for (const size of ['maxresdefault', 'sddefault']) {
      try {
        const url = source.replace('hqdefault', size);
        await run('curl.exe', ['--fail','--silent','--show-error','--proxy','http://127.0.0.1:7897','--max-time','12',url,'-o',candidate]);
        const bytes = fs.readFileSync(candidate), after = dimensions(bytes);
        if (after.width >= 640 && after.width > before.width) {
          fs.renameSync(candidate, file); result = { ...result, after, upgraded: true, fetchedFrom: url }; break;
        }
      } catch {}
    }
    if (fs.existsSync(candidate)) fs.unlinkSync(candidate);
    audit.push(result);
    if (audit.length % 50 === 0) console.log(`Checked ${audit.length}/${entries.length}, upgraded ${audit.filter(x => x.upgraded).length}`);
  }
}
(async () => {
  await Promise.all(Array.from({ length: 8 }, worker));
  fs.writeFileSync(path.join(__dirname,'official-cover-quality-20261005.json'), JSON.stringify(audit,null,2));
  console.log(JSON.stringify({ total: audit.length, upgraded: audit.filter(x => x.upgraded).length, keptOriginalCache: audit.filter(x => !x.upgraded).length }));
})();

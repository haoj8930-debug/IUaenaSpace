const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const run = promisify(execFile);
const root = path.resolve(__dirname, '..', 'dist');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/youtube-official.js'), 'utf8'), context);
const categories = context.window.IU_YOUTUBE_OFFICIAL.categories;
const urls = [...new Set(categories.flatMap(c => [c.cover, ...c.videos.map(v => v.thumbnail)]))];
fs.mkdirSync(path.join(root, 'assets/official-covers'), { recursive: true });
const cached = {};
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    const id = url.match(/\/vi\/([^/]+)/)?.[1];
    if (!id) continue;
    const local = `assets/official-covers/${id}.jpg`;
    const file = path.join(root, local);
    try {
      if (!fs.existsSync(file)) await run('curl.exe', ['--fail', '--silent', '--show-error', '--proxy', 'http://127.0.0.1:7897', '--max-time', '15', '--retry', '1', url, '-o', file]);
      if (fs.statSync(file).size > 1000) cached[url] = local;
    } catch { console.log(`Missing cover: ${id}`); }
  }
}
(async () => {
  await Promise.all(Array.from({ length: 8 }, worker));
  fs.writeFileSync(path.join(root, 'data/official-cover-cache.js'), `window.IU_OFFICIAL_COVERS = ${JSON.stringify(cached)};\n`);
  console.log(JSON.stringify({ requested: urls.length, cached: Object.keys(cached).length }));
})();

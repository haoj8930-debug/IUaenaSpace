const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
for (const name of ['local-albums', 'netease']) vm.runInNewContext(fs.readFileSync(path.join(root, 'dist/data', `${name}.js`), 'utf8'), context);
const tracks = context.window.IU_LOCAL_TRACKS;
const titleFor = raw => {
  const cut = raw.lastIndexOf(' - ');
  return (cut < 0 ? raw : raw.slice(0, cut)).replace(/^\(Bonus Track\)\s*/i, '').trim();
};
const keyFor = raw => raw.normalize('NFKC').replace(/\([^)]*\)/g, '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const cleanTranslation = raw => {
  let text = String(raw || '').split(/[;；]/)[0].trim();
  if (!/[\u3400-\u9fff]/.test(text) || /^(原唱|原曲|电视剧|电影|\d{6,}|\d{4}年.*(主题曲|现场))/.test(text)) return '';
  text = text.replace(/\s*\((?:原唱|原曲|With |Live|Inst|\d{4}).*$/i, '').replace(/\s*[（(](?:英文版|日文版|日语版|伴奏)[）)]/g, '').trim();
  return text;
};
async function main() {
  const cache = path.join(__dirname, 'song-title-online-metadata.json');
  let songs = [];
  if (process.argv.includes('--fetch') || !fs.existsSync(cache)) {
    const ids = [...new Set(tracks.map(t => t.neteaseId).filter(Boolean))];
    for (let i = 0; i < ids.length; i += 40) {
      const url = `https://music.163.com/api/song/detail/?ids=${encodeURIComponent(JSON.stringify(ids.slice(i, i + 40).map(Number)))}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Metadata request failed: ${response.status}`);
      const payload = await response.json();
      if (payload.code !== 200 || !Array.isArray(payload.songs)) throw new Error('Invalid metadata response');
      songs.push(...payload.songs.map(song => ({ id: String(song.id), name: song.name, aliases: [...song.alias || [], ...song.transNames || [], song.transName].filter(Boolean), source: `https://music.163.com/song?id=${song.id}` })));
      console.log(`Retrieved ${songs.length}/${ids.length} song records`);
    }
    fs.writeFileSync(cache, JSON.stringify({ checkedAt: '2026-10-02', songs }, null, 2));
  } else if (fs.existsSync(cache)) songs = JSON.parse(fs.readFileSync(cache, 'utf8')).songs;
  const idNames = new Map(), baseNames = new Map();
  const add = song => {
    const zh = song.aliases.map(cleanTranslation).find(Boolean);
    if (!zh) return;
    const entry = { zh, status: 'platform', source: song.source };
    idNames.set(String(song.id), entry);
    baseNames.set(keyFor(song.name), entry);
  };
  for (const album of context.window.IU_NETEASE_ALBUMS) for (const song of album.songs || []) add({ ...song, aliases: [...song.alia || [], ...song.tns || []], source: `https://music.163.com/song?id=${song.id}` });
  for (const song of songs) add(song);
  const manualFile = path.join(root, 'dist/data/song-title-overrides.json');
  const manual = fs.existsSync(manualFile) ? JSON.parse(fs.readFileSync(manualFile, 'utf8')) : [];
  for (const entry of manual) for (const title of entry.titles) baseNames.set(keyFor(title), entry);
  const result = {}, missing = [];
  for (const track of tracks) {
    const title = titleFor(track.originalTitle || track.title);
    let entry = baseNames.get(keyFor(title)) || idNames.get(track.neteaseId);
    if (!entry && /^[\u3400-\u9fff\s，、]+$/.test(title.replace(/\([^)]*\)/g, '').replace(/Live/gi, '').trim())) entry = { zh: title.replace(/\([^)]*\)/g, '').replace(/Live/gi, '').trim(), status: 'original', source: '' };
    if (!entry) { missing.push({ id: track.id, title }); continue; }
    const versions = [];
    if (/\binst\.?\b|\binstrumental\b/i.test(title)) versions.push('伴奏');
    if (/japanese/i.test(title)) versions.push('日语版');
    if (/english version/i.test(title)) versions.push('英语版');
    if (/acoustic/i.test(title)) versions.push('不插电版');
    if (/rock ver/i.test(title)) versions.push('摇滚版');
    if (/live|现场|演唱会|小剧场/i.test(title)) versions.push('现场版');
    if (/片段|short ver/i.test(title)) versions.push('片段');
    result[track.id] = { title, zh: entry.zh + (versions.length ? `（${versions.join(' · ')}）` : ''), status: entry.status || 'common', source: entry.source || '' };
  }
  if (process.argv.includes('--write')) {
    if (missing.length) throw new Error(`Cannot publish incomplete titles: ${missing.length} missing`);
    fs.writeFileSync(path.join(root, 'dist/data/song-titles.js'), `window.IU_SONG_TITLES = ${JSON.stringify(result, null, 2)};\nfor (const track of window.IU_LOCAL_TRACKS || []) {\n  const title = window.IU_SONG_TITLES[track.id];\n  if (title) Object.assign(track, { displayTitle: title.title, zh: title.zh, zhStatus: title.status, zhSource: title.source });\n}\n`);
  }
  const counts = Object.values(result).reduce((out, t) => { out[t.status] = (out[t.status] || 0) + 1; return out; }, {});
  console.log(JSON.stringify({ total: tracks.length, matched: Object.keys(result).length, counts, missing }, null, 2));
}
main().catch(error => { console.error(error); process.exit(1); });

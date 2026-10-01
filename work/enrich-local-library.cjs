const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = 'D:/音乐/IUIUImusic/专辑';
const context = { window: {} };
for (const file of ['local-albums.js', 'netease.js', 'catalog.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'dist/data', file), 'utf8'), context);
}
const { IU_LOCAL_ALBUMS: albums, IU_LOCAL_TRACKS: tracks, IU_NETEASE_ALBUMS: official, IU_CATALOG: catalog } = context.window;
const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/iu|아이유|\d+\s*-|\[[^\]]*\]|[^\p{L}\p{N}]/gu, '');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(mp3|flac|m4a|wav|ogg)$/i.test(entry.name)) files.push(file);
  }
}
walk(source);
const byId = new Map();
for (const album of official) for (const song of album.songs || []) byId.set(String(song.id), { album, song });
const cacheDirectory = 'D:/音乐/IUIUImusic/go-music-dl/catalog';
for (const filename of fs.readdirSync(cacheDirectory).filter(name => /^\d+\.json$/.test(name))) {
  const data = JSON.parse(fs.readFileSync(path.join(cacheDirectory, filename), 'utf8').replace(/^\uFEFF/, ''));
  if (data.album?.publishTime) for (const song of data.songs || []) byId.set(String(song.id), { album: data.album, song });
}
const dateDetails = JSON.parse(fs.readFileSync(path.join(cacheDirectory, 'online-song-date-details-20261001.json'), 'utf8').replace(/^\uFEFF/, ''));
for (const song of Object.values(dateDetails.songs || {})) if (song.album?.publishTime) byId.set(String(song.id), { album: song.album, song });
const lyricIndex = {};
const report = { tracks: tracks.length, matchedFiles: 0, lyrics: 0, translated: 0, dated: 0, missing: [] };
function parseLrc(text) {
  const rows = [];
  for (const line of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const stamp = line.match(/^\[(\d+):(\d+(?:\.\d+)?)\]/);
    const original = line.replace(/\[[^\]]*\]/g, '').trim();
    if (!original || (!stamp && /^\[/.test(line))) continue;
    if (/^(作词|作曲|编曲|制作|词|曲)\s*[:：]/.test(original)) continue;
    const time = stamp ? (Number(stamp[1]) * 60 + Number(stamp[2])) * 1000 : null;
    const previous = rows[rows.length - 1];
    if (previous && time !== null && previous.time === time && /[\u3400-\u9fff]/.test(original) && /[가-힣ぁ-ヿ]/.test(previous.original)) previous.translation = original;
    else rows.push({ time, original, translation: '' });
  }
  return rows;
}
for (const track of tracks) {
  const album = albums.find(a => a.id === track.releaseId);
  const candidates = files.filter(f => path.relative(source, f).split(path.sep)[0] === track.category);
  const file = candidates.find(f => path.basename(f, path.extname(f)).replace(/\s*\[[^\]]*\]\s*$/, '') === track.title)
    || candidates.find(f => normalize(path.basename(f, path.extname(f))) === normalize(track.title) && path.relative(source, f).includes(album.rawTitle));
  if (!file) { report.missing.push({ id: track.id, reason: 'file', title: track.title }); continue; }
  report.matchedFiles++;
  const songId = path.basename(file).match(/\[(\d+)\]/)?.[1] || path.basename(path.dirname(file)).match(/\[(\d+)\]/)?.[1];
  track.neteaseId = songId || '';
  const metadata = byId.get(songId);
  const release = metadata?.album || official.find(a => normalize(a.name) === normalize(album.title));
  const prior = catalog.tracks.find(t => normalize(t.title) === normalize(track.title));
  track.publishTime = release?.publishTime || (prior?.release === track.release && prior?.year && /^\d{4}$/.test(String(prior.year)) ? Date.UTC(Number(prior.year), 0, 1) : 0);
  track.year = track.publishTime ? new Date(track.publishTime).getUTCFullYear() : '';
  if (track.publishTime) report.dated++;
  const lrc = fs.readdirSync(path.dirname(file)).find(name => /\.lrc$/i.test(name));
  let lines = lrc ? parseLrc(fs.readFileSync(path.join(path.dirname(file), lrc), 'utf8')) : [];
  if (!lines.length) {
    try {
      const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format_tags=lyrics,LYRICS,unsyncedlyrics', '-of', 'json', file], { encoding: 'utf8' }));
      const text = Object.values(probe.format?.tags || {})[0];
      if (text) lines = parseLrc(text);
    } catch {}
  }
  const bundled = songId && path.join(root, 'dist/assets/lyrics', `${songId}.json`);
  if (bundled && fs.existsSync(bundled)) {
    const payload = JSON.parse(fs.readFileSync(bundled, 'utf8').replace(/^\uFEFF/, ''));
    if (payload.lines?.length) lines = payload.lines;
  }
  if (lines.length) {
    lyricIndex[track.id] = { title: track.title, release: track.release, lines };
    report.lyrics++;
    if (lines.some(line => line.translation)) report.translated++;
  } else report.missing.push({ id: track.id, reason: 'lyrics', title: track.title });
}
for (const album of albums) album.publishTime = Math.max(0, ...tracks.filter(t => t.releaseId === album.id).map(t => t.publishTime || 0));
fs.writeFileSync(path.join(root, 'dist/data/local-albums.js'), `window.IU_LOCAL_ALBUMS = ${JSON.stringify(albums, null, 2)};\nwindow.IU_LOCAL_TRACKS = ${JSON.stringify(tracks, null, 2)};\n`);
fs.writeFileSync(path.join(root, 'dist/data/local-lyrics.js'), `window.IU_LOCAL_LYRICS = ${JSON.stringify(lyricIndex)};\n`);
fs.writeFileSync(path.join(root, 'work/local-library-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

import fs from "node:fs";
import vm from "node:vm";

const context = { window: {} };
vm.createContext(context);
for (const file of ["dist/data/netease.js", "dist/data/lyrics.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

const albums = context.window.IU_NETEASE_ALBUMS || [];
const library = context.window.IU_LYRICS_BY_NETEASE_ID || {};
const tracks = albums.flatMap((album) =>
  (album.songs || []).map((song) => ({ ...song, album: album.name, albumId: album.id })),
);
const ids = tracks.map((track) => String(track.id));
const counts = new Map();
for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);

const missing = tracks
  .filter((track) => !library[String(track.id)])
  .map((track) => ({ id: track.id, title: track.name, album: track.album }));
const orphaned = Object.keys(library).filter((id) => !counts.has(id));
const duplicates = [...counts.entries()].filter(([, count]) => count > 1);
const translated = Object.values(library).filter((entry) => entry.translation?.trim()).length;
const emptyLyrics = Object.entries(library)
  .filter(([, entry]) => !entry.lyrics?.trim())
  .map(([id]) => id);

console.log(
  JSON.stringify(
    {
      albums: albums.length,
      tracks: tracks.length,
      uniqueTrackIds: counts.size,
      lyricEntries: Object.keys(library).length,
      translated,
      missing,
      orphaned,
      duplicates,
      emptyLyrics,
    },
    null,
    2,
  ),
);

if (
  albums.length !== 61 ||
  tracks.length !== 363 ||
  Object.keys(library).length !== 361 ||
  missing.length !== 2 ||
  orphaned.length ||
  duplicates.length ||
  emptyLyrics.length
) {
  process.exitCode = 1;
}

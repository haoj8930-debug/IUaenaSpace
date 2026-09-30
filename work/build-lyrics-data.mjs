import fs from "node:fs";
import path from "node:path";

const [cacheDirectory, outputFile] = process.argv.slice(2);

if (!cacheDirectory || !outputFile) {
  throw new Error("Usage: node build-lyrics-data.mjs <cache-directory> <output-file>");
}

function stripTiming(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/^\s*(\[[0-9:.]+\])+\s*/, "")
        .replace(/^\s*\[(ar|ti|al|by|offset|length):[^\]]*\]\s*/i, "")
        .trimEnd(),
    )
    .filter((line) => line.trim())
    .join("\n")
    .trim();
}

const records = [];
for (const entry of fs.readdirSync(cacheDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !/^网易云_\d+\.json$/u.test(entry.name)) continue;
  const fullPath = path.join(cacheDirectory, entry.name);
  const raw = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
  const payload = JSON.parse(raw);
  const song = payload.SongVo || {};
  const lyric = payload.LyricVo || {};
  const lyrics = stripTiming(lyric.Lyric);
  if (!song.Id || !lyrics) continue;
  records.push([
    String(song.Id),
    {
      title: song.Name || "",
      release: song.Album || "",
      lyrics,
      translation: stripTiming(lyric.TranslateLyric),
      note: "网易云歌词；原文与平台翻译已按歌曲 ID 精确匹配。",
    },
  ]);
}

records.sort(([left], [right]) => Number(left) - Number(right));
const library = Object.fromEntries(records);
const output = `window.IU_LYRICS_BY_NETEASE_ID = ${JSON.stringify(library, null, 2)};\n`;
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output, "utf8");
console.log(JSON.stringify({ entries: records.length, outputFile, bytes: Buffer.byteLength(output) }));

const fs = require("fs");
const path = require("path");

const sourceRoot = process.argv[2];
const outputRoot = process.argv[3];
const manifestPath = process.argv[4];

if (!sourceRoot || !outputRoot || !manifestPath) {
  throw new Error("Usage: node build-user-lyrics.cjs <source> <output> <manifest>");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function parseFolder(folderName) {
  const match = folderName.match(/^\d{4}-\d{2}-\d{2}\s+-\s+(.+?)\s+\[(\d+)\]$/);
  return match ? { release: match[1].trim(), albumId: Number(match[2]) } : { release: "", albumId: null };
}

function parseFile(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const match = fileName.match(/^(\d+)\s+-\s+(.+?)\s+-\s+(.+)$/);
  if (!match) return null;
  return { id: Number(match[1]), title: match[2].trim(), artist: match[3].trim() };
}

function isCredit(line) {
  return /^(作词|作曲|编曲|翻译|制作人|监制|混音|母带|和声|录音|吉他|贝斯|鼓|钢琴|键盘|弦乐|Programmed|Lyrics|Composed|Arranged)\s*[:：]/i.test(line);
}

function parseTimestamp(minutes, seconds) {
  return Math.round((Number(minutes) * 60 + Number(seconds)) * 1000);
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function parseLrc(text) {
  const groups = new Map();
  const credits = [];

  for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const timestamps = [...rawLine.matchAll(/\[(\d{1,3}):(\d{2}(?:\.\d{1,3})?)\]/g)];
    if (!timestamps.length) continue;
    const content = rawLine
      .replace(/\[(\d{1,3}):(\d{2}(?:\.\d{1,3})?)\]/g, "")
      .replace(/\[(?:by|ar|ti|al|offset|length):[^\]]*\]/gi, "")
      .trim();
    if (!content) continue;
    if (isCredit(content)) {
      if (!credits.includes(content)) credits.push(content);
      continue;
    }

    for (const timestamp of timestamps) {
      const milliseconds = parseTimestamp(timestamp[1], timestamp[2]);
      const current = groups.get(milliseconds) || [];
      if (!current.includes(content)) current.push(content);
      groups.set(milliseconds, current);
    }
  }

  const lines = [...groups.entries()]
    .sort(([left], [right]) => left - right)
    .map(([time, values]) => ({
      time,
      timeLabel: formatTime(time),
      original: values[0] || "",
      translation: values.slice(1).join(" / "),
    }))
    .filter((line) => line.original);

  return { credits, lines };
}

const files = walk(sourceRoot).filter((filePath) => /\.lrc$/i.test(filePath));
const preferred = new Map();

for (const filePath of files) {
  const metadata = parseFile(filePath);
  if (!metadata) continue;
  const isTemporary = filePath.includes(`${path.sep}_全部歌词暂存${path.sep}`);
  const existing = preferred.get(metadata.id);
  if (!existing || (existing.isTemporary && !isTemporary)) {
    preferred.set(metadata.id, { filePath, isTemporary, metadata });
  }
}

fs.mkdirSync(outputRoot, { recursive: true });
for (const oldFile of fs.readdirSync(outputRoot)) {
  if (/\.json$/i.test(oldFile)) fs.rmSync(path.join(outputRoot, oldFile));
}

const manifest = {};
let translated = 0;
let empty = 0;

for (const [id, item] of [...preferred.entries()].sort(([left], [right]) => left - right)) {
  const folder = parseFolder(path.basename(path.dirname(item.filePath)));
  const parsed = parseLrc(fs.readFileSync(item.filePath, "utf8"));
  const hasTranslation = parsed.lines.some((line) => line.translation);
  if (hasTranslation) translated += 1;
  if (!parsed.lines.length) empty += 1;

  const payload = {
    id,
    title: item.metadata.title,
    artist: item.metadata.artist,
    release: folder.release,
    albumId: folder.albumId,
    credits: parsed.credits,
    lines: parsed.lines,
  };
  fs.writeFileSync(path.join(outputRoot, `${id}.json`), `${JSON.stringify(payload)}\n`, "utf8");
  manifest[id] = {
    id,
    title: payload.title,
    artist: payload.artist,
    release: payload.release,
    path: `./assets/lyrics/${id}.json`,
    lineCount: payload.lines.length,
    hasTranslation,
  };
}

fs.writeFileSync(
  manifestPath,
  `window.IU_LYRICS_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8",
);

console.log(JSON.stringify({ files: files.length, uniqueSongs: preferred.size, translated, empty }, null, 2));

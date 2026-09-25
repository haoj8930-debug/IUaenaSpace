import fs from "node:fs";
import path from "node:path";

const root = "D:/codex/iu_archive";
const archive = JSON.parse(fs.readFileSync(path.join(root, "iu_archive.json"), "utf8"));
const videos = JSON.parse(fs.readFileSync(path.join(root, "videos.json"), "utf8")).items;

const palette = [
  ["#0d1324", "#d6414f", "#f7ead2"],
  ["#14213d", "#fca311", "#fff7df"],
  ["#102a43", "#2ec4b6", "#f6f7eb"],
  ["#2b193d", "#d72670", "#fff1f3"],
  ["#263d2b", "#e9c46a", "#fff8dc"],
  ["#1f2937", "#9d4edd", "#f4edff"],
  ["#2f1b0c", "#c8553d", "#fff0dc"],
  ["#101820", "#fee715", "#fffde7"],
];

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/g, " ")
    .trim();

const releases = archive.releases.map((release, index) => {
  const colors = palette[index % palette.length];
  return {
    ...release,
    cover: {
      colors,
      initials: release.title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    },
  };
});

const releaseByTitle = new Map(releases.map((release) => [release.title, release]));
const videoByTitle = new Map();
for (const video of videos) {
  const key = normalize(video.title);
  if (!videoByTitle.has(key)) videoByTitle.set(key, []);
}
for (const video of videos) {
  const key = normalize(video.title);
  videoByTitle.get(key).push(video);
}

const q = (value) => encodeURIComponent(`IU ${value}`);
const tracks = archive.tracks.map((track, index) => {
  const release = releaseByTitle.get(track.release);
  const key = normalize(track.title);
  const shortKey = normalize(track.title.split("(")[0]);
  const matchedVideos = videoByTitle.get(key) || videoByTitle.get(shortKey) || [];
  return {
    id: `track-${index + 1}`,
    date: track.date,
    year: track.year,
    release: track.release,
    type: track.type,
    language: track.language,
    trackNo: track.track_no,
    title: track.title,
    originalTitle: track.original_title,
    lyrics: track.lyrics,
    music: track.music,
    arrangement: track.arrangement,
    length: track.length,
    version: track.instrumental_or_version,
    iuCreationRole: track.iu_creation_role,
    source: track.source,
    cover: release?.cover,
    audioLinks: {
      spotify: `https://open.spotify.com/search/${q(track.title)}`,
      youtubeMusic: `https://music.youtube.com/search?q=${q(track.title)}`,
      appleMusic: `https://music.apple.com/us/search?term=${q(track.title)}`,
    },
    mv: matchedVideos.map((video) => ({
      title: video.title,
      year: video.year,
      type: video.type,
      director: video.director,
      notes: video.notes,
      source: video.source,
      youtube: `https://www.youtube.com/results?search_query=${q(`${video.title} MV`)}`,
    })),
  };
});

const data = {
  checkedDate: archive.checked_date,
  sources: archive.sources,
  releases,
  tracks,
  videos,
};

fs.mkdirSync("dist/data", { recursive: true });
fs.writeFileSync(
  "dist/data/catalog.js",
  `window.IU_CATALOG = ${JSON.stringify(data, null, 2)};\n`,
  "utf8",
);

console.log(`catalog: ${tracks.length} tracks, ${releases.length} releases, ${videos.length} videos`);

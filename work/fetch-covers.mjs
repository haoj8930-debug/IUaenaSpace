import fs from "node:fs";
import path from "node:path";

const catalogPath = "dist/data/catalog.js";
const source = fs.readFileSync(catalogPath, "utf8");
const json = source.replace(/^window\.IU_CATALOG = /, "").replace(/;\s*$/, "");
const catalog = JSON.parse(json);
const outDir = "dist/assets/covers";

fs.mkdirSync(outDir, { recursive: true });

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

function simplify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/iu\s*/g, "")
    .replace(/[\[\]().!?'"’‘“”:_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreCandidate(release, candidate) {
  const title = simplify(release.title);
  const name = simplify(candidate.collectionName);
  const artist = simplify(candidate.artistName);
  let score = 0;
  if (artist.includes("iu") || candidate.artistName === "IU") score += 6;
  if (name === title) score += 12;
  if (name.includes(title) || title.includes(name)) score += 8;
  if (String(candidate.releaseDate || "").startsWith(String(release.year))) score += 3;
  if (candidate.collectionType === "Album") score += 1;
  return score;
}

async function searchCover(release) {
  const terms = [
    `IU ${release.title}`,
    `아이유 ${release.title}`,
    release.title,
  ];
  let best = null;
  for (const term of terms) {
    const url = `https://itunes.apple.com/search?${new URLSearchParams({
      term,
      media: "music",
      entity: "album",
      limit: "12",
      country: "US",
    })}`;
    const response = await fetch(url);
    if (!response.ok) continue;
    const data = await response.json();
    for (const item of data.results || []) {
      const score = scoreCandidate(release, item);
      if (!best || score > best.score) best = { score, item };
    }
    if (best?.score >= 12) break;
  }
  return best?.score >= 8 ? best.item : null;
}

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`download failed ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
}

let matched = 0;
for (const release of catalog.releases) {
  try {
    const item = await searchCover(release);
    if (!item?.artworkUrl100) {
      console.log(`miss: ${release.title}`);
      continue;
    }
    const artworkUrl = item.artworkUrl100.replace(/100x100bb\.(jpg|png)$/, "600x600bb.$1");
    const ext = path.extname(new URL(artworkUrl).pathname) || ".jpg";
    const fileName = `${slugify(release.title)}${ext}`;
    const filePath = path.join(outDir, fileName);
    await download(artworkUrl, filePath);
    release.cover.image = `./assets/covers/${fileName}`;
    release.cover.provider = "Apple Music / iTunes";
    release.cover.providerUrl = item.collectionViewUrl;
    release.cover.matchedName = item.collectionName;
    matched += 1;
    console.log(`cover: ${release.title} -> ${item.collectionName}`);
  } catch (error) {
    console.log(`error: ${release.title}: ${error.message}`);
  }
}

const coverByRelease = new Map(catalog.releases.map((release) => [release.title, release.cover]));
for (const track of catalog.tracks) {
  track.cover = coverByRelease.get(track.release) || track.cover;
}

fs.writeFileSync(catalogPath, `window.IU_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");
console.log(`matched ${matched}/${catalog.releases.length}`);

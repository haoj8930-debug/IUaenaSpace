import fs from "node:fs";
import path from "node:path";

const catalogPath = "dist/data/catalog.js";
const source = fs.readFileSync(catalogPath, "utf8");
const catalog = JSON.parse(source.replace(/^window\.IU_CATALOG = /, "").replace(/;\s*$/, ""));
const outDir = "dist/assets/covers";

const manual = {
  "I□U": {
    url: "https://coverartarchive.org/release/60c1bac3-9390-4e7e-904f-67c7305b0f22/45750522162-500.jpg",
    provider: "Cover Art Archive / MusicBrainz",
    providerUrl: "https://musicbrainz.org/release/60c1bac3-9390-4e7e-904f-67c7305b0f22",
    file: "i-u.jpg",
  },
  "A Flower Bookmark 2": {
    url: "https://coverartarchive.org/release/588b1f21-5e99-4137-9e34-6584caaa6c35/17865361098-500.jpg",
    provider: "Cover Art Archive / MusicBrainz",
    providerUrl: "https://musicbrainz.org/release/588b1f21-5e99-4137-9e34-6584caaa6c35",
    file: "a-flower-bookmark-2.jpg",
  },
  "A Flower Bookmark 3": {
    url: "https://coverartarchive.org/release/b4ed8958-5849-4ec4-8d3a-c64833430cd7/42083540500-500.jpg",
    provider: "Cover Art Archive / MusicBrainz",
    providerUrl: "https://musicbrainz.org/release/b4ed8958-5849-4ec4-8d3a-c64833430cd7",
    file: "a-flower-bookmark-3.jpg",
  },
};

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()));
}

for (const release of catalog.releases) {
  const item = manual[release.title];
  if (!item) continue;
  try {
    await download(item.url, path.join(outDir, item.file));
    release.cover.image = `./assets/covers/${item.file}`;
    release.cover.provider = item.provider;
    release.cover.providerUrl = item.providerUrl;
    release.cover.matchedName = release.title;
    console.log(`manual: ${release.title}`);
  } catch (error) {
    console.log(`manual miss: ${release.title}: ${error.message}`);
  }
}

const covers = new Map(catalog.releases.map((release) => [release.title, release.cover]));
for (const track of catalog.tracks) {
  track.cover = covers.get(track.release) || track.cover;
}

fs.writeFileSync(catalogPath, `window.IU_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");

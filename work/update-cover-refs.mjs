import fs from "node:fs";

const catalogPath = "dist/data/catalog.js";
const source = fs.readFileSync(catalogPath, "utf8");
const catalog = JSON.parse(source.replace(/^window\.IU_CATALOG = /, "").replace(/;\s*$/, ""));
const manual = {
  "I□U": [
    "i-u.jpg",
    "https://musicbrainz.org/release/60c1bac3-9390-4e7e-904f-67c7305b0f22",
  ],
  "A Flower Bookmark 2": [
    "a-flower-bookmark-2.jpg",
    "https://musicbrainz.org/release/588b1f21-5e99-4137-9e34-6584caaa6c35",
  ],
  "A Flower Bookmark 3": [
    "a-flower-bookmark-3.jpg",
    "https://musicbrainz.org/release/b4ed8958-5849-4ec4-8d3a-c64833430cd7",
  ],
};

for (const release of catalog.releases) {
  const item = manual[release.title];
  if (!item) continue;
  release.cover.image = `./assets/covers/${item[0]}`;
  release.cover.provider = "Cover Art Archive / MusicBrainz";
  release.cover.providerUrl = item[1];
  release.cover.matchedName = release.title;
}

const covers = new Map(catalog.releases.map((release) => [release.title, release.cover]));
for (const track of catalog.tracks) {
  track.cover = covers.get(track.release) || track.cover;
}

fs.writeFileSync(catalogPath, `window.IU_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");
console.log("updated manual cover refs");

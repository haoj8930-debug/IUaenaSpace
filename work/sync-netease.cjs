const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist", "data", "netease.js");
const headers = {
  Referer: "https://music.163.com/",
  "User-Agent": "Mozilla/5.0",
};

async function fetchJson(url, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      if (data.code !== 200) throw new Error(`API code ${data.code}`);
      return data;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 350));
    }
  }
  throw lastError;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  const artist = await fetchJson("https://music.163.com/api/artist/albums/160947?limit=100&offset=0");
  const albums = await mapWithConcurrency(artist.hotAlbums || [], 4, async (summary, index) => {
    const detail = await fetchJson(`https://music.163.com/api/v1/album/${summary.id}`);
    const album = detail.album || summary;
    process.stdout.write(`\r${String(index + 1).padStart(2, " ")}/${artist.hotAlbums.length} ${album.name}`);
    return {
      name: album.name || summary.name,
      id: album.id || summary.id,
      publishTime: album.publishTime || summary.publishTime,
      size: album.size || detail.songs?.length || summary.size || 0,
      type: album.type || "",
      subtype: album.subType || album.subtype || "",
      picUrl: album.picUrl || summary.picUrl || "",
      songs: (detail.songs || []).map((song) => ({
        id: song.id,
        name: song.name,
        alia: song.alia || [],
        tns: song.tns || [],
        artists: (song.ar || []).map((artistItem) => artistItem.name),
        duration: song.dt || 0,
        no: Number(song.no) || 0,
        disc: song.cd || "1",
        mvId: song.mv || 0,
      })),
    };
  });
  albums.sort((a, b) => b.publishTime - a.publishTime || b.id - a.id);
  fs.writeFileSync(output, `window.IU_NETEASE_ALBUMS = ${JSON.stringify(albums, null, 2)};\n`, "utf8");
  const songCount = albums.reduce((sum, album) => sum + album.songs.length, 0);
  process.stdout.write(`\nSaved ${albums.length} releases and ${songCount} release tracks to ${output}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

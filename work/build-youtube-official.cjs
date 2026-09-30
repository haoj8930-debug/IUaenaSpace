const fs = require("fs");
const path = require("path");

const root = __dirname;
const sourceDir = path.join(root, "youtube-official");
const output = path.join(root, "..", "dist", "data", "youtube-official.js");
const categories = JSON.parse(fs.readFileSync(path.join(sourceDir, "categories.json"), "utf8"));

const payload = {
  source: "https://www.youtube.com/@dlwlrma/featured",
  categories: categories.map((category) => {
    const source = JSON.parse(fs.readFileSync(path.join(sourceDir, `${category.id}.json`), "utf8"));
    const seen = new Set();
    const videos = (source.entries || [])
      .filter((entry) => entry && entry.id && !seen.has(entry.id) && seen.add(entry.id))
      .map((entry) => ({
        id: entry.id,
        title: entry.title || "IU Official",
        url: `https://youtu.be/${entry.id}`,
        thumbnail: `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`,
        duration: Number(entry.duration) || 0,
        views: Number(entry.view_count) || 0,
      }));

    return {
      id: category.id,
      title: category.title,
      zh: category.zh,
      url: category.url,
      cover: videos[0]?.thumbnail || "",
      videoCount: videos.length,
      videos,
    };
  }),
};

fs.writeFileSync(output, `window.IU_YOUTUBE_OFFICIAL = ${JSON.stringify(payload)};\n`, "utf8");
console.log(`Wrote ${output}`);
console.log(payload.categories.map((item) => `${item.id}: ${item.videoCount}`).join("\n"));

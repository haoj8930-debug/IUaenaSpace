const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "dist", "data", "merch.js");
const outputDir = path.join(root, "dist", "assets", "merch");
const source = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataPath });
const data = sandbox.window.IU_MERCH;

fs.mkdirSync(outputDir, { recursive: true });

async function download(item) {
  const fileName = `${item.bvid}.jpg`;
  const destination = path.join(outputDir, fileName);
  if (!fs.existsSync(destination) || fs.statSync(destination).size < 1024) {
    const response = await fetch(item.cover, {
      headers: {
        Referer: "https://www.bilibili.com/",
        "User-Agent": "Mozilla/5.0 UAENA-Archive/1.0",
      },
    });
    if (!response.ok) throw new Error(`${item.bvid}: HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error(`${item.bvid}: ${contentType || "not an image"}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1024) throw new Error(`${item.bvid}: image is too small (${bytes.length} bytes)`);
    fs.writeFileSync(destination, bytes);
  }
  item.remoteCover = item.remoteCover || item.cover;
  item.cover = `./assets/merch/${fileName}`;
}

async function main() {
  const items = data.categories.flatMap((category) => category.items);
  const concurrency = 8;
  let cursor = 0;
  const failures = [];

  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor++];
      try {
        await download(item);
        process.stdout.write(".");
      } catch (error) {
        failures.push(error.message);
        process.stdout.write("x");
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stdout.write("\n");
  if (failures.length) throw new Error(`Failed covers:\n${failures.join("\n")}`);

  fs.writeFileSync(dataPath, `window.IU_MERCH = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  console.log(`Localized ${items.length} Bilibili covers in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

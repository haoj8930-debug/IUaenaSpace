import fs from "node:fs";

const text = ["dist/script.js", "dist/styles.css", "dist/index.html"]
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

const urls = [
  ...new Set(
    [...text.matchAll(/https?:\/\/[^"'`\s)\\]+/g)]
      .map((match) => match[0].replace(/[),;]+$/, ""))
      .filter((url) => /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url) || /mzstatic|tmdb|wixstatic|bugsm|spotifycdn/i.test(url)),
  ),
];

console.log(`urls ${urls.length}`);

const bad = [];
for (const url of urls) {
  try {
    let response = await fetch(url, { method: "HEAD" });
    if (!response.ok || response.status === 405) {
      response = await fetch(url, { method: "GET" });
    }
    if (!response.ok) {
      bad.push([response.status, url]);
    }
  } catch (error) {
    bad.push(["ERR", url, error.message]);
  }
}

if (bad.length > 0) {
  console.log("BAD");
  for (const item of bad) {
    console.log(item.join(" "));
  }
  process.exit(1);
}

console.log("all image urls ok");

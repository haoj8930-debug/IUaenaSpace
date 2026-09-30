import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = path.resolve(import.meta.dirname, "..");
const candidates = JSON.parse(await fs.readFile(path.join(root, "work", "screen-cover-candidates.json"), "utf8"));
const outputDir = path.join(root, "dist", "assets", "screen-landscape");
const manifestPath = path.join(root, "dist", "data", "screen-covers.js");

const titles = {
  "program-heroes": "Heroes",
  "program-welcome-show": "Welcome to the Show",
  "program-kiss-cry": "Kim Yuna's Kiss & Cry",
  "program-hyori-homestay": "Hyori's Homestay (Season 1)",
  "tv-dream-high": "Dream High",
  "tv-salamander": "Salamander Guru and The Shadows",
  "tv-dream-high-2": "Dream High 2",
  "tv-you-are-best": "You Are the Best!",
  "tv-bel-ami": "Bel Ami",
  "tv-producers": "The Producers",
  "tv-moon-lovers": "Moon Lovers: Scarlet Heart Ryeo",
  "tv-my-mister": "My Mister",
  "tv-persona": "Persona",
  "tv-hotel-del-luna": "Hotel del Luna",
  "tv-tangerines": "When Life Gives You Tangerines",
  "tv-perfect-crown": "Perfect Crown",
  "film-sammy-2": "A Turtle's Tale 2: Sammy's Escape from Paradise",
  "film-real": "Real",
  "film-shades-heart": "Shades of the Heart",
  "film-broker": "Broker",
  "film-dream": "Dream",
  "concert-golden-hour": "IU Concert: The Golden Hour",
  "concert-hereh": "IU HEREH World Tour Concert",
  "concert-love-poem": "IU Love Poem Concert",
  "concert-winning": "IU Concert: The Winning Live",
  "stage-good-day": "Good Day Music Show Stage",
  "stage-you-i": "You & I Music Show Stage",
  "stage-red-shoes": "The Red Shoes Music Show Stage",
  "stage-friday": "Friday Music Show Stage",
  "stage-twenty-three": "Twenty-Three Music Show Stage",
  "stage-palette": "Palette Music Show Stage",
  "stage-through-night": "Through the Night Music Show Stage",
  "stage-bbibbi": "BBIBBI Music Show Stage",
  "stage-blueming": "Blueming Music Show Stage",
  "stage-celebrity": "Celebrity Music Show Stage",
  "stage-lilac": "LILAC Music Show Stage",
  "stage-coin": "Coin Music Show Stage",
  "stage-strawberry-moon": "strawberry moon Music Show Stage",
  "stage-love-wins-all": "Love Wins All Music Show Stage",
  "stage-shopper": "Shopper Music Show Stage",
  "stage-holssi": "Holssi Music Show Stage",
};

const overrides = {
  "program-kiss-cry": "https://s2.dmcdn.net/v/1xuF31D-X8FBgUBFV/x1080",
  "tv-dream-high-2": "https://thumbnews.nateimg.co.kr/view610/onimg.nate.com/orgImg/pt/2012/01/30/201201302215779122_1.jpg",
};

const youtubeOverrides = {
  "tv-bel-ami": "gPfG_C2NwFM",
};

const python = "D:\\学习\\python\\python.exe";
const ytDlp = path.join(root, "work", "yt-dlp", "yt_dlp", "__main__.py");

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function download(url, destination) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`Unexpected content type ${type} from ${url}`);
  await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function downloadYoutube(id, destination) {
  const output = destination.replace(/\.jpg$/i, ".%(ext)s");
  await execFileAsync(python, [
    ytDlp,
    "--skip-download",
    "--write-thumbnail",
    "--convert-thumbnails", "jpg",
    "--socket-timeout", "20",
    "--retries", "1",
    "--no-warnings",
    "-o", output,
    `https://www.youtube.com/watch?v=${id}`,
  ], { timeout: 60000, windowsHide: true });
}

await fs.mkdir(outputDir, { recursive: true });
const manifest = {};
const failures = [];

await Promise.all(candidates.map(async (candidate) => {
  const title = titles[candidate.key];
  if (!title) return;
  const file = `${safeName(candidate.key)}.jpg`;
  const destination = path.join(outputDir, file);
  const urls = overrides[candidate.key] ? [overrides[candidate.key]] : [];
  let saved = false;
  const youtubeId = youtubeOverrides[candidate.key] || candidate.id;
  if (youtubeId && !urls.length) {
    try {
      await downloadYoutube(youtubeId, destination);
      saved = true;
    } catch (error) {
      failures.push(`${candidate.key}: ${error.message}`);
    }
  }
  for (const url of urls) {
    try {
      await download(url, destination);
      saved = true;
      break;
    } catch (error) {
      failures.push(`${candidate.key}: ${error.message}`);
    }
  }
  try {
    await fs.access(destination);
    saved = true;
  } catch {}
  if (saved) manifest[title] = `./assets/screen-landscape/${file}`;
}));

await fs.writeFile(manifestPath, `window.IU_SCREEN_COVERS = ${JSON.stringify(manifest, null, 2)};\n`);
console.log(`Saved ${Object.keys(manifest).length}/${Object.keys(titles).length} covers.`);
if (failures.length) console.log(failures.join("\n"));


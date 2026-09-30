import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const run = promisify(execFile);
const python = "D:\\学习\\python\\python.exe";
const ytdlp = "work\\yt-dlp\\yt_dlp\\__main__.py";

const queries = {
  "program-heroes": "IU Heroes SBS Entertainment 아이유 영웅호걸",
  "program-welcome-show": "IU Welcome to the Show SBS 웰컴 투 더 쇼",
  "program-kiss-cry": "IU Kim Yuna Kiss and Cry SBS 아이유 키스앤크라이",
  "program-hyori-homestay": "IU Hyori Homestay JTBC official 효리네 민박",
  "tv-dream-high": "IU Dream High KBS World official",
  "tv-salamander": "IU Salamander Guru SBS official 도롱뇽도사",
  "tv-dream-high-2": "IU Dream High 2 KBS World official",
  "tv-you-are-best": "IU You Are The Best KBS World official 최고다 이순신",
  "tv-bel-ami": "IU Bel Ami KBS World official 예쁜남자",
  "tv-producers": "IU The Producers KBS World official 프로듀사",
  "tv-moon-lovers": "IU Moon Lovers Scarlet Heart Ryeo SBS official trailer",
  "tv-my-mister": "IU My Mister official trailer tvN",
  "tv-persona": "IU Persona Netflix official trailer",
  "tv-hotel-del-luna": "IU Hotel Del Luna tvN official trailer",
  "tv-tangerines": "When Life Gives You Tangerines Netflix official trailer IU",
  "tv-perfect-crown": "IU Perfect Crown official teaser",
  "film-sammy-2": "Sammy's Adventures 2 official trailer",
  "film-real": "Real 2017 Korean movie official trailer IU",
  "film-shades-heart": "Shades of the Heart official trailer IU",
  "film-broker": "Broker official trailer NEON IU",
  "film-dream": "Dream Korean movie official trailer IU Park Seo Joon",
  "concert-golden-hour": "IU The Golden Hour official trailer",
  "concert-hereh": "IU HEREH World Tour official concert trailer",
  "concert-love-poem": "IU Love Poem concert official live",
  "concert-winning": "IU The Winning concert official trailer",
  "stage-good-day": "IU Good Day live KBS WORLD TV",
  "stage-you-i": "IU You and I live KBS WORLD TV",
  "stage-red-shoes": "IU The Red Shoes live KBS WORLD TV",
  "stage-friday": "IU Friday live KBS WORLD TV",
  "stage-twenty-three": "IU Twenty Three live MBCkpop",
  "stage-palette": "IU Palette live KBS WORLD TV",
  "stage-through-night": "IU Through the Night live official",
  "stage-bbibbi": "IU BBIBBI live KBS WORLD TV",
  "stage-blueming": "IU Blueming live KBS WORLD TV",
  "stage-celebrity": "IU Celebrity live official",
  "stage-lilac": "IU LILAC live KBS WORLD TV",
  "stage-coin": "IU Coin live KBS WORLD TV",
  "stage-strawberry-moon": "IU strawberry moon live official",
  "stage-love-wins-all": "IU Love wins all live official",
  "stage-shopper": "IU Shopper live official",
  "stage-holssi": "IU Holssi live official",
};

async function lookup([key, query]) {
  const { stdout } = await run(
    python,
    [ytdlp, "--no-warnings", "--skip-download", "--print", "%(id)s|%(title)s|%(thumbnail)s|%(channel)s", `ytsearch1:${query}`],
    { cwd: process.cwd(), maxBuffer: 1024 * 1024 * 4 },
  );
  const [id, title, thumbnail, channel] = stdout.trim().split("|");
  return { key, query, id, title, thumbnail, channel, url: `https://www.youtube.com/watch?v=${id}` };
}

const entries = Object.entries(queries);
const results = [];
for (let index = 0; index < entries.length; index += 4) {
  const batch = entries.slice(index, index + 4);
  results.push(...(await Promise.all(batch.map(lookup))));
  console.error(`resolved ${Math.min(index + batch.length, entries.length)} / ${entries.length}`);
}

await fs.writeFile("work/screen-cover-candidates.json", `${JSON.stringify(results, null, 2)}\n`, "utf8");
console.log(JSON.stringify(results.map(({ key, title, channel, id }) => ({ key, title, channel, id })), null, 2));

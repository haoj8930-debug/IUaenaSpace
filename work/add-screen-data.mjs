import fs from "node:fs";

const catalogPath = "dist/data/catalog.js";
const source = fs.readFileSync(catalogPath, "utf8");
const catalog = JSON.parse(source.replace(/^window\.IU_CATALOG = /, "").replace(/;\s*$/, ""));

const readItems = (file) => JSON.parse(fs.readFileSync(file, "utf8")).items;
const base = "D:/codex/iu_archive";

catalog.screen = {
  checkedDate: "2026-09-14",
  films: readItems(`${base}/films.json`),
  tv: readItems(`${base}/tv.json`),
  programs: readItems(`${base}/programs.json`),
};

fs.writeFileSync(catalogPath, `window.IU_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");
console.log(`screen: ${catalog.screen.films.length} films, ${catalog.screen.tv.length} tv, ${catalog.screen.programs.length} programs`);

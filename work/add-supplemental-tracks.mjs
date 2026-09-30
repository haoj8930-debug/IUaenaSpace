import fs from "node:fs";

const catalogPath = "dist/data/catalog.js";
const source = fs.readFileSync(catalogPath, "utf8");
const catalog = JSON.parse(source.replace(/^window\.IU_CATALOG = /, "").replace(/;\s*$/, ""));

const q = (value) => encodeURIComponent(`IU ${value}`);
const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/g, " ")
    .trim();

const supplementalRelease = {
  date: "",
  year: 2026,
  title: "Collaborations, Covers & Specials",
  type: "补充档案",
  language: "多语种",
  track_count: 0,
  source: "https://en.wikipedia.org/wiki/IU_discography",
  cover: {
    colors: ["#101820", "#d9a441", "#fff7df"],
    initials: "IU",
    image: "./assets/hero-notebook.png",
    provider: "IU-UAENA Archive",
    providerUrl: "https://iu-uaena.vercel.app",
    matchedName: "Collaborations, Covers & Specials",
  },
};

if (!catalog.releases.some((release) => release.title === supplementalRelease.title)) {
  catalog.releases.push(supplementalRelease);
}

const release = catalog.releases.find((item) => item.title === supplementalRelease.title);
const existingKeys = new Set(catalog.tracks.map((track) => `${normalize(track.title)}::${normalize(track.release)}`));
const videosByTitle = new Map();
for (const video of catalog.videos || []) {
  const key = normalize(video.title);
  if (!videosByTitle.has(key)) videosByTitle.set(key, []);
  videosByTitle.get(key).push(video);
}

const additions = [
  {
    date: "2014-12-24",
    year: 2014,
    title: "12월 24일 (December 24; D.ear Cover)",
    originalTitle: "12월 24일",
    type: "翻唱 / 特别公开",
    language: "韩语",
    lyrics: "D.ear",
    music: "D.ear",
    source: "https://www.soompi.com/article/682671wpp/iu-gifts-fans-with-sweet-cover-of-d-ears-december-24",
    notes: "IU 在 2014 年圣诞前夕公开的 D.ear《December 24》翻唱礼物。",
  },
  {
    date: "2009",
    year: 2009,
    title: "247",
    originalTitle: "",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "The Three Views featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_videography",
  },
  {
    date: "2010",
    year: 2010,
    title: "I Believe in Love",
    originalTitle: "",
    type: "合作 / OST",
    language: "韩语",
    artist: "IU and Yoo Seung-ho",
    source: "https://en.wikipedia.org/wiki/IU_videography",
  },
  {
    date: "2011",
    year: 2011,
    title: "Ice Flower",
    originalTitle: "",
    type: "合作 / 主题曲",
    language: "韩语",
    artist: "IU and Yuna Kim",
    source: "https://en.wikipedia.org/wiki/IU_videography",
  },
  {
    date: "2012",
    year: 2012,
    title: "Sea of Moonlight",
    originalTitle: "달빛바다",
    type: "合作 / 项目单曲",
    language: "韩语",
    artist: "IU and Fiestar",
    source: "https://en.wikipedia.org/wiki/IU_videography",
  },
  {
    date: "2014",
    year: 2014,
    title: "Not Spring, Love, or Cherry Blossoms",
    originalTitle: "봄 사랑 벚꽃 말고",
    type: "合作 / 单曲",
    language: "韩语",
    artist: "High4 and IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2014",
    year: 2014,
    title: "Sogyeokdong",
    originalTitle: "소격동",
    type: "合作 / 项目单曲",
    language: "韩语",
    artist: "Seo Taiji and IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2014",
    year: 2014,
    title: "When Would It Be",
    originalTitle: "언제쯤이면",
    type: "合作 / 单曲",
    language: "韩语",
    artist: "Yoon Hyun-sang and IU",
    source: "https://en.wikipedia.org/wiki/IU_videography",
  },
  {
    date: "2015",
    year: 2015,
    title: "Leon",
    originalTitle: "레옹",
    type: "合作 / 节目企划",
    language: "韩语",
    artist: "Park Myung-soo and IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2017",
    year: 2017,
    title: "Love Story",
    originalTitle: "",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "Epik High featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2018",
    year: 2018,
    title: "SoulMate",
    originalTitle: "",
    type: "合作 / 单曲",
    language: "韩语",
    artist: "Zico and IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2018",
    year: 2018,
    title: "Fairytale",
    originalTitle: "동화",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "Kim Dong-ryul featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2019-12-09",
    year: 2019,
    title: "First Winter",
    originalTitle: "첫 겨울이니까",
    type: "合作 / 数字单曲",
    language: "韩语",
    artist: "Sung Si-kyung and IU",
    lyrics: "Kyuho Lee",
    music: "Kyuho Lee",
    arrangement: "Gang Hwa-seong",
    length: "4:00",
    source: "https://en.wikipedia.org/wiki/First_Winter_(song)",
  },
  {
    date: "2020",
    year: 2020,
    title: "Small Room",
    originalTitle: "작은방",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "Sweet Sorrow featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2021",
    year: 2021,
    title: "Nakka",
    originalTitle: "낙하",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "AKMU featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2022",
    year: 2022,
    title: "Mother Nature (H₂O)",
    originalTitle: "",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "Kang Seung-won featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2022",
    year: 2022,
    title: "Ganadara",
    originalTitle: "GANADARA",
    type: "合作 / 单曲",
    language: "韩语",
    artist: "Jay Park featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
  {
    date: "2023",
    year: 2023,
    title: "People Pt. 2",
    originalTitle: "사람 Pt.2",
    type: "合作 / Featuring",
    language: "韩语",
    artist: "Agust D featuring IU",
    source: "https://en.wikipedia.org/wiki/IU_discography",
  },
];

let maxTrackNumber = catalog.tracks.reduce((max, track) => {
  const value = Number(String(track.id || "").replace("track-", ""));
  return Number.isFinite(value) ? Math.max(max, value) : max;
}, 0);

const makeMv = (item) => {
  const matched = videosByTitle.get(normalize(item.title)) || [];
  if (matched.length) {
    return matched.map((video) => ({
      title: video.title,
      year: video.year,
      type: video.type,
      director: video.director,
      notes: video.notes,
      source: video.source,
      youtube: `https://www.youtube.com/results?search_query=${q(`${video.title} IU`)}`,
    }));
  }
  return [
    {
      title: item.title,
      year: String(item.year || ""),
      type: item.type || "补充影像搜索",
      director: "",
      notes: item.notes || item.artist || "",
      source: item.source,
      youtube: `https://www.youtube.com/results?search_query=${q(`${item.title} IU`)}`,
    },
  ];
};

let added = 0;
for (const item of additions) {
  const key = `${normalize(item.title)}::${normalize(supplementalRelease.title)}`;
  if (existingKeys.has(key)) continue;
  maxTrackNumber += 1;
  catalog.tracks.push({
    id: `track-${maxTrackNumber}`,
    date: item.date,
    year: item.year,
    release: supplementalRelease.title,
    type: item.type,
    language: item.language,
    trackNo: "",
    title: item.title,
    originalTitle: item.originalTitle || "",
    lyrics: item.lyrics || "",
    music: item.music || "",
    arrangement: item.arrangement || "",
    length: item.length || "",
    version: item.artist || "",
    iuCreationRole: item.type.includes("翻唱") ? "cover vocal" : "collaboration / featured vocal",
    source: item.source,
    cover: release.cover,
    audioLinks: {
      spotify: `https://open.spotify.com/search/${q(item.title)}`,
      youtubeMusic: `https://music.youtube.com/search?q=${q(item.title)}`,
      appleMusic: `https://music.apple.com/us/search?term=${q(item.title)}`,
    },
    mv: makeMv(item),
  });
  existingKeys.add(key);
  added += 1;
}

release.track_count = catalog.tracks.filter((track) => track.release === supplementalRelease.title).length;
catalog.sources.supplemental_collaborations = "https://en.wikipedia.org/wiki/IU_discography";
catalog.sources.december_24_cover = "https://www.soompi.com/article/682671wpp/iu-gifts-fans-with-sweet-cover-of-d-ears-december-24";
catalog.sources.first_winter = "https://en.wikipedia.org/wiki/First_Winter_(song)";

fs.writeFileSync(catalogPath, `window.IU_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");
console.log(`added ${added} supplemental tracks; total ${catalog.tracks.length}`);

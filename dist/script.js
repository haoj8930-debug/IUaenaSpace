const themeStorageKey = "iu-theme-mode-v1";

const catalog = window.IU_CATALOG;

const paletteShowSource = "https://www.kpopn.com/2022/12/18/ius-palette-cover-songs";

const paletteShowRelease = {
  date: "2020-09-01",
  year: 2020,
  title: "IU's Palette Covers",
  type: "节目翻唱 / Live covers",
  language: "韩语 / 英语",
  track_count: 17,
  source: paletteShowSource,
  cover: {
    colors: ["#111827", "#bfa3ff", "#fff7df"],
    initials: "IP",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/94/ec/24/94ec2442-5add-d1ca-5eba-37f1298abfbc/cover_KM0005225_1.jpg/600x600bb.jpg",
    provider: "Apple Music / iTunes",
    providerUrl: "https://music.apple.com/us/album/palette/1229073300",
    matchedName: "IU's Palette live cover collection",
  },
};

const paletteShowTracks = [
  {
    title: "Palette",
    originalTitle: "팔레트",
    originalArtist: "IU",
    zh: "调色盘",
    year: 2020,
    trackNo: 1,
    guest: "LOCO",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/94/ec/24/94ec2442-5add-d1ca-5eba-37f1298abfbc/cover_KM0005225_1.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/palette-feat-g-dragon/1229073300?i=1229073310&uo=4",
  },
  {
    title: "Give You My Heart",
    originalTitle: "마음을 드려요",
    originalArtist: "IU",
    zh: "献上我的心",
    year: 2020,
    trackNo: 2,
    guest: "AKMU",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/46/24/3a/46243ae1-132d-7a20-6fb1-5a08d66b3a55/cover_-_OST_Part.11.png/600x600bb.webp",
    appleMusic: "https://music.apple.com/us/search?term=IU%20Give%20You%20My%20Heart",
  },
  {
    title: "BBIBBI",
    originalTitle: "삐삐",
    originalArtist: "IU",
    zh: "哔哔",
    year: 2020,
    trackNo: 3,
    guest: "ITZY",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8a/2a/fb/8a2afbb2-728b-f160-8210-ba43146e9d83/cover-_DS.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/bbibbi/1438614238?i=1438614348&uo=4",
  },
  {
    title: "Dear Name",
    originalTitle: "이름에게",
    originalArtist: "IU",
    zh: "致名字",
    year: 2020,
    trackNo: 4,
    guest: "Jukjae",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/94/ec/24/94ec2442-5add-d1ca-5eba-37f1298abfbc/cover_KM0005225_1.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/dear-name/1229073300?i=1229073408&uo=4",
  },
  {
    title: "Love Poem",
    originalTitle: "Love Poem",
    originalArtist: "IU",
    zh: "爱之诗",
    year: 2020,
    trackNo: 5,
    guest: "Kim Se-jeong",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b8/b8/18/b8b81899-a984-be85-5656-ec1f2fc10227/5_Love_poem.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/love-poem/1488300927?i=1488300934&uo=4",
  },
  {
    title: "Twenty",
    originalTitle: "스무살",
    originalArtist: "AKMU",
    zh: "二十岁",
    year: 2021,
    trackNo: 6,
    guest: "AKMU",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/26/91/a5/2691a522-ccac-9eb4-e157-d58150175a38/160503_AKMU_DS.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/search?term=AKMU%20Twenty",
  },
  {
    title: "Hold My Hand",
    originalTitle: "내 손을 잡아",
    originalArtist: "IU",
    zh: "抓住我的手",
    year: 2021,
    trackNo: 7,
    guest: "Lee Mujin",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music/9a/32/c3/mzi.xhujnhaf.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/hold-my-hand/444687177?i=444687268&uo=4",
  },
  {
    title: "strawberry moon",
    originalTitle: "strawberry moon",
    originalArtist: "IU",
    zh: "草莓月亮",
    year: 2021,
    trackNo: 8,
    guest: "Lee Mujin",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/ac/6c/61ac6cf8-f016-5fbb-79b0-8cfa51da855b/cover.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/strawberry-moon/1590459601?i=1590459636&uo=4",
  },
  {
    title: "Blueming",
    originalTitle: "블루밍",
    originalArtist: "IU",
    zh: "蓝色绽放",
    year: 2021,
    trackNo: 9,
    guest: "Lee Mujin",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b8/b8/18/b8b81899-a984-be85-5656-ec1f2fc10227/5_Love_poem.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/blueming/1488300927?i=1488300930&uo=4",
  },
  {
    title: "Secret Garden",
    originalTitle: "비밀의 화원",
    originalArtist: "Lee Sang-eun / IU cover",
    zh: "秘密花园",
    year: 2021,
    trackNo: 10,
    guest: "Lee Mujin",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/b7/12/bc/b712bc53-60c9-9f1b-0c2d-48bb294e0cbf/cover-.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/secret-garden/1288487936?i=1288487938&uo=4",
  },
  {
    title: "Pierrot Laughs at Us",
    originalTitle: "삐에로는 우릴 보고 웃지",
    originalArtist: "Kim Wan-sun",
    zh: "小丑看着我们笑",
    year: 2022,
    trackNo: 11,
    guest: "Kim Wan-sun",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a1/64/ab/a164abbd-2329-3948-3b2c-c24b0fac53bc/8809856783844.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/pierrot-laughs-at-us-live/1614362006?i=1614362173&uo=4",
  },
  {
    title: "Lullaby",
    originalTitle: "자장가",
    originalArtist: "IU",
    zh: "摇篮曲",
    year: 2022,
    trackNo: 12,
    guest: "Jay Park",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b8/b8/18/b8b81899-a984-be85-5656-ec1f2fc10227/5_Love_poem.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/lullaby/1488300927?i=1488300933&uo=4",
  },
  {
    title: "Mamma Mia",
    originalTitle: "맘마미아",
    originalArtist: "KARA",
    zh: "妈妈咪呀",
    year: 2022,
    trackNo: 13,
    guest: "KARA",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/51/e1/0c/51e10cfb-cbba-beb7-a4e7-f1657413a922/KM0002883-_-0818.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/mamma-mia/910032820?i=910032826&uo=4",
  },
  {
    title: "Darl+ing",
    originalTitle: "Darl+ing",
    originalArtist: "SEVENTEEN",
    zh: "亲爱的",
    year: 2022,
    trackNo: 14,
    guest: "SEVENTEEN",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/26/fa/9f26fae1-c93e-0d47-a0a6-b8543e2a28aa/192641997679_Cover.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/darl-ing/1618314646?i=1618314654&uo=4",
  },
  {
    title: "Celebrity",
    originalTitle: "Celebrity",
    originalArtist: "IU",
    zh: "名人",
    year: 2023,
    trackNo: 15,
    guest: "NewJeans",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/35/9f/83/359f83b3-1423-3153-1641-98e948b7fc65/cover_-_EDAM_5_LILAC.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/celebrity/1560113132?i=1560113348&uo=4",
  },
  {
    title: "Hurt",
    originalTitle: "Hurt",
    originalArtist: "NewJeans",
    zh: "受伤",
    year: 2023,
    trackNo: 16,
    guest: "NewJeans",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/64/34/4e64344b-3ac6-c503-2c41-257a15401416/192641873096_Cover.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/hurt/1635469682?i=1635470002&uo=4",
  },
  {
    title: "Fate",
    originalTitle: "나는 아픈 건 딱 질색이니까",
    originalArtist: "i-dle",
    zh: "命运",
    year: 2025,
    trackNo: 17,
    guest: "i-dle",
    image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/34/27/5234273c-5585-261b-4fc5-b10cfd9bbd71/8804775368240.jpg/600x600bb.jpg",
    appleMusic: "https://music.apple.com/us/album/fate/1801725556?i=1801725670&uo=4",
  },
];

const officialSingleSupplements = [
  { title: "BBIBBI", originalTitle: "삐삐", zh: "哔哔", year: 2018, date: "2018-10-10", type: "数字单曲", originalArtist: "IU", image: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8a/2a/fb/8a2afbb2-728b-f160-8210-ba43146e9d83/cover-_DS.jpg/600x600bb.jpg", appleMusic: "https://music.apple.com/us/album/bbibbi/1438614238?i=1438614348&uo=4" },
  { title: "eight", originalTitle: "에잇", zh: "八", year: 2020, date: "2020-05-06", type: "数字单曲 / Collaboration", originalArtist: "IU feat. SUGA", image: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6b/65/4d/6b654d71-ed85-c6c4-8fe2-ef3d8e9f2ee0/cover_-.jpg/600x600bb.jpg", appleMusic: "https://music.apple.com/us/album/eight-feat-suga/1511885175?i=1511885178&uo=4" },
  { title: "strawberry moon", originalTitle: "strawberry moon", zh: "草莓月亮", year: 2021, date: "2021-10-19", type: "数字单曲", originalArtist: "IU", image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/ac/6c/61ac6cf8-f016-5fbb-79b0-8cfa51da855b/cover.jpg/600x600bb.jpg", appleMusic: "https://music.apple.com/us/album/strawberry-moon/1590459601?i=1590459636&uo=4" },
];

const collaborationReleaseSupplements = {
  "12월 24일 (December 24; D.ear Cover)": { releaseTitle: "12월 24일", date: "2014-12-24", type: "翻唱 / 特别公开", image: "./assets/covers/december-24-user.jpg", provider: "你提供的录音室截图", providerUrl: "https://www.soompi.com/article/682671wpp/iu-gifts-fans-with-sweet-cover-of-d-ears-december-24" },
  "247": { releaseTitle: "247", date: "2009-07-01", type: "合作 / Featuring", image: "https://static.wixstatic.com/media/856917_24d99e10868d40dd9b1af29243b2841f~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85/79955213_1_400x400.jpg", provider: "IU Canada", providerUrl: "https://www.iu-canada.com/participating-work" },
  "I Believe in Love": { releaseTitle: "I Believe in Love", date: "2010-08-02", type: "合作单曲 / OST", image: "https://image.bugsm.co.kr/album/images/500/2322/232249.jpg", provider: "Bugs", providerUrl: "https://music.bugs.co.kr/track/2049722" },
  "Ice Flower": { releaseTitle: "Ice Flower", date: "2011-06-21", type: "合作单曲 / Theme song", image: "https://is1-ssl.mzstatic.com/image/thumb/Music/05/7a/e6/mzi.mjjlquaz.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/ice-flower-feat-kim-se-hwang/448569719?i=448569729&uo=4" },
  "Sea of Moonlight": { releaseTitle: "Sea of Moonlight", date: "2012-07-26", type: "合作单曲 / Project single", image: "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/a3/a4/a6/a3a4a6bd-c699-f742-a17b-0b9251349540/KM0001684-_LOEN_TREE_-0726.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/sea-of-moonlight-loen-tree-summer-story/547870496?i=547870503&uo=4" },
  "Not Spring, Love, or Cherry Blossoms": { releaseTitle: "Not Spring, Love or Cherry Blossoms", date: "2014-04-08", type: "合作单曲", image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/58/dd/86/58dd8626-594e-7f43-c791-ac74f6f96c76/KM0002693-High4_DS-0408.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/not-spring-love-or-cherry-blossoms/858263201?i=858263219&uo=4" },
  Sogyeokdong: { releaseTitle: "SOGYEOKDONG", date: "2014-10-02", type: "项目单曲", image: "https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/d1/60/3d/d1603d8d-a789-25fd-13ff-d2c89120d020/KM0002959-_DS-1002.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/sogyeokdong/925184315?i=925184316&uo=4" },
  "When Would It Be": { releaseTitle: "When Would It Be", date: "2014-10-31", type: "合作单曲", image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/95/3f/ba/953fba58-24ec-db8b-599e-cb48cd48f6a5/KM0003002-_-1031.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/when-would-it-be/935513547?i=935513555&uo=4" },
  Leon: { releaseTitle: "Leon", date: "2015-08-22", type: "节目企划单曲", image: "https://static.wixstatic.com/media/856917_5daff048157e4f5d82ad93aa8e8a0a80~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85/artworks-000127171586-csnymb-t500x500_jp.jpg", provider: "IU Canada", providerUrl: "https://www.iu-canada.com/participating-work" },
  "Love Story": { releaseTitle: "LOVE STORY", date: "2017-10-23", type: "合作 / Featuring", image: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/19/00/dd/1900dd2f-2d37-f089-8fc0-bb2c07a81802/COVER_fin_4000X4000.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/love-story-feat-iu/1299101327?i=1299101336&uo=4" },
  SoulMate: { releaseTitle: "SoulMate", date: "2018-07-30", type: "合作单曲", image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/db/57/17/db571748-dfc5-0e07-3ffb-5125cf1efa40/886447238585.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/soulmate-feat-iu/1417068270?i=1417069365&uo=4" },
  Fairytale: { releaseTitle: "Fairy Tale", date: "2018-12-07", type: "合作 / Featuring", image: "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/cd/b4/c8/cdb4c875-3541-01cf-c200-fa7dc02600da/cover-_DS_NEW.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/fairy-tale-feat-iu/1445990936?i=1445990938&uo=4" },
  "First Winter": { releaseTitle: "First Winter", date: "2019-12-09", type: "合作数字单曲", image: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/a2/f1/b3/a2f1b357-d49c-0750-7bc0-1b5800729daf/cover_-_DS.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/first-winter/1490826312?i=1490826313&uo=4" },
  "Small Room": { releaseTitle: "Small Room", date: "2020-10-29", type: "合作 / Featuring", image: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/89/23/c5/8923c57e-d9b0-9c28-a068-bb488a198f87/Sweet_sorrow_1.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/small-room-feat-iu/1566811829?i=1566811830&uo=4" },
  Nakka: { releaseTitle: "NAKKA", date: "2021-07-26", type: "合作 / Featuring", image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/12/31/63/12316366-55bb-065c-8ad9-47e107fa79b2/AKMU_NEXT_EPISODE.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/nakka-with-iu/1577524102?i=1577524107&uo=4" },
  "Mother Nature": { releaseTitle: "Mother Nature (H₂O)", date: "2022-01-27", type: "合作 / Featuring", image: "https://i.scdn.co/image/ab67616d0000b273a8c641a42f5d054e0322be5d", provider: "Spotify", providerUrl: "https://open.spotify.com/album/6gdnJ11QQyvpVljTUR3BWw" },
  Ganadara: { releaseTitle: "GANADARA", date: "2022-03-11", type: "合作单曲", image: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/73/fb/31/73fb31ac-1ca6-643d-3bef-44832b988fbf/cover_KM0014893_1.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/ganadara-feat-iu/1613272549?i=1613272550&uo=4" },
  "People Pt. 2": { releaseTitle: "People Pt.2", date: "2023-04-07", type: "合作 / Featuring", image: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ce/fa/4d/cefa4dc8-b2cd-6b20-f5ca-62a8df250859/196922430312_Cover.jpg/600x600bb.jpg", provider: "Apple Music / iTunes", providerUrl: "https://music.apple.com/us/album/people-pt-2/1680524006?i=1680524008&uo=4" },
};

const userTrackCoverSupplements = {
  "Dear My Crazy Soulmate": { image: "./assets/covers/dear-my-crazy-soulmate-user.jpg", provider: "你提供的封面", providerUrl: "https://www.youtube.com/results?search_query=IU%20Dear%20My%20Crazy%20Soulmate" },
  "Holding a Star in My Heart": { image: "./assets/covers/holding-a-star-user.jpg", provider: "你提供的封面", providerUrl: "https://www.youtube.com/results?search_query=IU%20%EB%B3%84%EC%9D%84%20%EC%B0%BE%EB%8A%94%20%EC%95%84%EC%9D%B4" },
};

function makePaletteShowTrack(item) {
  const query = encodeURIComponent(`IU's Palette ${item.title} ${item.guest || ""}`.trim());
  return {
    id: `palette-show-${String(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${item.trackNo}`,
    year: item.year,
    release: paletteShowRelease.title,
    trackNo: item.trackNo,
    title: item.title,
    originalTitle: item.originalTitle,
    originalArtist: item.originalArtist,
    type: "IU's Palette 节目翻唱",
    language: "韩语 / 英语",
    length: "",
    lyrics: item.originalArtist,
    music: item.originalArtist,
    arrangement: "IU's Palette live band",
    version: `${item.guest} episode live cover`,
    iuCreationRole: "live cover vocal / program performance",
    source: paletteShowSource,
    searchQuery: `IU's Palette ${item.title} ${item.guest || item.originalArtist}`,
    cover: {
      colors: ["#141827", "#bfa3ff", "#fff7df"],
      initials: "IP",
      image: item.image,
      provider: "Apple Music / iTunes",
      providerUrl: item.appleMusic,
      matchedName: `${item.title} cover artwork`,
    },
    audioLinks: {
      spotify: `https://open.spotify.com/search/${query}`,
      youtubeMusic: `https://music.youtube.com/search?q=${query}`,
      appleMusic: item.appleMusic || `https://music.apple.com/us/search?term=${query}`,
    },
    mv: [
      {
        title: `IU's Palette - ${item.title}`,
        year: item.year,
        type: "YouTube program performance",
        notes: `${item.guest ? `${item.guest} 出演期` : "节目舞台"}翻唱/互唱版本。`,
        youtube: `https://www.youtube.com/results?search_query=${query}`,
      },
    ],
  };
}

function applyCatalogSupplements() {
  catalog.sources.palette_show_covers = paletteShowSource;
  catalog.sources.apple_music_artwork = "https://music.apple.com/";
  if (!catalog.releases.some((release) => release.title === paletteShowRelease.title)) catalog.releases.push(paletteShowRelease);
  const existingReleases = new Set(catalog.releases.map((release) => release.title));
  const pushRelease = (release) => {
    if (!existingReleases.has(release.title)) {
      catalog.releases.push(release);
      existingReleases.add(release.title);
    }
  };
  officialSingleSupplements.forEach((item) => {
    pushRelease({ date: item.date, year: item.year, title: item.title, type: item.type, language: "韩语", track_count: 1, source: item.appleMusic, cover: { colors: ["#141827", "#d6414f", "#fff7df"], initials: item.title.slice(0, 2).toUpperCase(), image: item.image, provider: "Apple Music / iTunes", providerUrl: item.appleMusic, matchedName: item.title } });
  });
  Object.entries(collaborationReleaseSupplements).forEach(([trackTitle, item]) => {
    pushRelease({ date: item.date, year: Number(String(item.date).slice(0, 4)), title: item.releaseTitle, type: item.type, language: "韩语", track_count: 1, source: item.providerUrl, cover: { colors: ["#141827", "#9b6b5d", "#fff7df"], initials: item.releaseTitle.slice(0, 2).toUpperCase(), image: item.image, provider: item.provider, providerUrl: item.providerUrl, matchedName: item.releaseTitle } });
    catalog.tracks.filter((track) => track.title === trackTitle || (trackTitle === "Mother Nature" && track.title.startsWith("Mother Nature"))).forEach((track) => {
      track.release = item.releaseTitle;
      track.cover = { colors: ["#141827", "#9b6b5d", "#fff7df"], initials: item.releaseTitle.slice(0, 2).toUpperCase(), image: item.image, provider: item.provider, providerUrl: item.providerUrl, matchedName: item.releaseTitle };
      track.source = item.providerUrl;
      track.audioLinks = { spotify: 'https://open.spotify.com/search/' + encodeURIComponent(track.title + ' IU'), youtubeMusic: 'https://music.youtube.com/search?q=' + encodeURIComponent(track.title + ' IU'), appleMusic: item.providerUrl };
    });
  });
  Object.entries(userTrackCoverSupplements).forEach(([trackTitle, item]) => {
    catalog.tracks
      .filter((track) => normalizeKey(track.title).includes(normalizeKey(trackTitle)))
      .forEach((track) => {
        track.cover = {
          ...(track.cover || {}),
          image: item.image,
          provider: item.provider,
          providerUrl: item.providerUrl,
          matchedName: trackTitle,
        };
      });
  });
  const existingTrackIds = new Set(catalog.tracks.map((track) => track.id));
  officialSingleSupplements.forEach((item) => {
    const id = 'single-' + String(item.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!existingTrackIds.has(id) && !catalog.tracks.some((track) => track.title.toLowerCase() === item.title.toLowerCase() && track.release === item.title)) {
      catalog.tracks.push({ id, year: item.year, release: item.title, trackNo: 1, title: item.title, originalTitle: item.originalTitle, originalArtist: item.originalArtist, type: item.type, language: "韩语", length: "", lyrics: item.originalArtist, music: item.originalArtist, arrangement: "", version: "official single", iuCreationRole: item.originalArtist.includes("IU") ? "official vocal / release" : "featured vocal", source: item.appleMusic, cover: { colors: ["#141827", "#d6414f", "#fff7df"], initials: item.title.slice(0, 2).toUpperCase(), image: item.image, provider: "Apple Music / iTunes", providerUrl: item.appleMusic, matchedName: item.title }, audioLinks: { spotify: 'https://open.spotify.com/search/' + encodeURIComponent(item.title + ' IU'), youtubeMusic: 'https://music.youtube.com/search?q=' + encodeURIComponent(item.title + ' IU'), appleMusic: item.appleMusic }, mv: [{ title: item.title, year: item.year, type: "official music video / audio", notes: "官方单曲相关影像入口。", youtube: 'https://www.youtube.com/results?search_query=' + encodeURIComponent('IU ' + item.title + ' MV') }] });
      existingTrackIds.add(id);
    }
  });
  paletteShowTracks.map(makePaletteShowTrack).forEach((track) => {
    if (!existingTrackIds.has(track.id)) {
      catalog.tracks.push(track);
      existingTrackIds.add(track.id);
    }
  });
  catalog.screen = catalog.screen || {};
  delete catalog.screen.musicVariety;
}

function applyNeteaseAlbumCovers() {
  const albums = Array.isArray(window.IU_NETEASE_ALBUMS) ? window.IU_NETEASE_ALBUMS : [];
  if (!albums.length) return;
  const aliases = new Map([
    ["이 별로부터", "Unknown Planet"],
    ["바이, 썸머", "Bye, Summer"],
    ["꽃갈피 셋", "A Flower Bookmark 3"],
    ["꽃갈피 둘", "A Flower Bookmark 2"],
    ["꽃갈피", "A Flower Bookmark"],
    ["조각집", "Pieces"],
    ["Love poem", "Love Poem"],
    ["REAL", "Real"],
    ["REAL+", "Real+"],
    ["I □ U", "I□U"],
    ["스무 살의 봄", "Spring of a Twenty Year Old"],
    ["Good Day (Japanese Version)", "Good Day"],
    ["삐삐", "BBIBBI"],
    ["에잇", "eight"],
    ["첫 겨울이니까", "First Winter"],
    ["강승원 이집 PART.3 - Mother Nature (H₂O)", "Mother Nature (H₂O)"],
    ["People Pt. 2", "People Pt.2"],
    ["사랑이 잘", "Can't Love You Anymore"],
    ["밤편지", "Through the Night"],
  ]);
  const normalized = (value) => String(value || "").toLowerCase().replace(/[\s·'’“”"!?,.\-–—+□()]/g, "");
  const titleVariants = (value) => {
    const text = String(value || "").trim();
    const variants = new Set([normalized(text)]);
    const withoutGroups = text.replace(/\([^)]*\)|\[[^\]]*\]/g, " ").trim();
    if (withoutGroups) variants.add(normalized(withoutGroups));
    for (const group of text.matchAll(/\(([^)]*)\)|\[([^\]]*)\]/g)) {
      String(group[1] || group[2] || "")
        .split(/[;,/]/)
        .map((part) => part.replace(/\b(feat(?:uring)?|with|narration by|lit\.)\b.*$/i, "").trim())
        .filter(Boolean)
        .forEach((part) => variants.add(normalized(part)));
    }
    return [...variants].filter(Boolean);
  };
  const versionFlags = (value) => ({
    instrumental: /\b(inst(?:rumental)?\.?)\b|伴奏/i.test(String(value || "")),
    live: /\blive\b|现场|라이브/i.test(String(value || "")),
  });
  const versionsCompatible = (left, right) => {
    const a = versionFlags(left);
    const b = versionFlags(right);
    return a.instrumental === b.instrumental && a.live === b.live;
  };
  const releaseByKey = new Map(catalog.releases.map((release) => [normalized(release.title), release]));
  const assignedAlbumIds = new Set();
  const usedReleaseTitles = new Set(catalog.releases.map((release) => release.title));
  const cjk = /[\u3400-\u9fff]/;
  const hangul = /[\u3131-\u318e\uac00-\ud7a3]/;
  const releaseType = (album) => {
    if (/ost|soundtrack/i.test(album.name)) return "OST / 影视原声";
    if (album.subtype === "现场版") return album.type === "Single" ? "现场单曲" : "现场专辑";
    if (album.type === "Single" || album.size === 1) return "数字单曲";
    if (album.type === "EP") return "迷你专辑";
    return "正规专辑";
  };
  const languageFor = (value) => /[\u3040-\u30ff]/.test(value) ? "日语" : hangul.test(value) ? "韩语" : "英语";
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "";
    const seconds = Math.round(milliseconds / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };

  albums.forEach((album) => {
    const albumUrl = `https://music.163.com/#/album?id=${album.id}`;
    const date = new Date(album.publishTime).toISOString().slice(0, 10);
    const year = new Date(album.publishTime).getFullYear();
    const mappedTitle = aliases.get(album.name) || album.name;
    let release = releaseByKey.get(normalized(mappedTitle));
    if (release?.neteaseAlbumId && release.neteaseAlbumId !== album.id) release = null;
    if (!release) {
      let uniqueTitle = mappedTitle;
      if (usedReleaseTitles.has(uniqueTitle)) {
        uniqueTitle = album.size === 1 ? `${mappedTitle} (Single)` : `${mappedTitle} (${year})`;
      }
      release = {
        date,
        year,
        title: uniqueTitle,
        type: releaseType(album),
        language: languageFor(album.name),
        track_count: album.songs?.length || album.size || 0,
        source: albumUrl,
        cover: {},
      };
      catalog.releases.push(release);
      usedReleaseTitles.add(uniqueTitle);
      releaseByKey.set(normalized(uniqueTitle), release);
    }
    release.neteaseAlbumId = album.id;
    release.date = release.date || date;
    release.year = release.year || year;
    release.track_count = album.songs?.length || album.size || release.track_count;
    release.source = albumUrl;
    release.cover = {
      ...(release.cover || {}),
      image: album.picUrl,
      providerUrl: albumUrl,
      matchedName: album.name,
    };
    assignedAlbumIds.add(album.id);

    const existingForRelease = catalog.tracks.filter((track) => track.release === release.title);
    const assignedTrackIds = new Set();
    (album.songs || []).forEach((song, index) => {
      const aliasesForSong = [...(song.alia || []), ...(song.tns || [])].filter(Boolean);
      const englishTitle = aliasesForSong.find((value) => /[A-Za-z]/.test(value) && !hangul.test(value) && !cjk.test(value));
      const chineseTitle = aliasesForSong.find((value) => cjk.test(value) && !hangul.test(value)) || "";
      const displayTitle = englishTitle || song.name;
      const candidateKeys = new Set([song.name, displayTitle, ...aliasesForSong].flatMap(titleVariants));
      const songDescriptor = [song.name, displayTitle, ...aliasesForSong].join(" ");
      let existing = existingForRelease.find((track) => {
        if (assignedTrackIds.has(track.id) || !versionsCompatible(`${track.title} ${track.originalTitle || ""}`, songDescriptor)) return false;
        const trackKeys = [track.title, track.originalTitle].flatMap(titleVariants);
        return trackKeys.some((key) => candidateKeys.has(key));
      });
      if (!existing && song.no) {
        existing = existingForRelease.find((track) =>
          !assignedTrackIds.has(track.id) &&
          Number(track.trackNo) === Number(song.no) &&
          versionsCompatible(`${track.title} ${track.originalTitle || ""}`, songDescriptor),
        );
      }
      if (existing) {
        assignedTrackIds.add(existing.id);
        existing.neteaseSongId = song.id;
        existing.zh = existing.zh || chineseTitle;
        existing.cover = release.cover;
        existing.source = `https://music.163.com/#/song?id=${song.id}`;
        existing.length = existing.length || formatDuration(song.duration);
        return;
      }
      const songUrl = `https://music.163.com/#/song?id=${song.id}`;
      const queryText = `IU ${displayTitle}`;
      catalog.tracks.push({
        id: `netease-${album.id}-${song.id}`,
        neteaseSongId: song.id,
        date,
        year,
        release: release.title,
        trackNo: song.no || index + 1,
        title: displayTitle,
        originalTitle: song.name,
        originalArtist: (song.artists || []).join(" & "),
        zh: chineseTitle,
        type: release.type,
        language: languageFor(song.name),
        length: formatDuration(song.duration),
        lyrics: "",
        music: "",
        arrangement: "",
        version: "",
        iuCreationRole: "",
        source: songUrl,
        cover: release.cover,
        audioLinks: {
          spotify: `https://open.spotify.com/search/${encodeURIComponent(queryText)}`,
          youtubeMusic: `https://music.youtube.com/search?q=${encodeURIComponent(queryText)}`,
          appleMusic: `https://music.apple.com/us/search?term=${encodeURIComponent(queryText)}`,
        },
        mv: song.mvId ? [{ title: `${displayTitle} MV`, year, type: "官方 MV", notes: "歌曲发行条目收录的 MV。", youtube: `https://music.163.com/#/mv?id=${song.mvId}` }] : [],
      });
    });
  });
  catalog.sources.netease_discography = "https://music.163.com/#/artist/album?id=160947&limit=12&offset=0";
}

applyCatalogSupplements();

applyNeteaseAlbumCovers();

ensureTrackMediaLinks();

const globalSearchInput = document.querySelector("#globalSearchInput");

const globalSearchType = document.querySelector("#globalSearchType");

const globalSearchCount = document.querySelector("#globalSearchCount");

const globalSearchResults = document.querySelector("#globalSearchResults");

const searchPage = document.querySelector(".searchPage");

const screenDetailDialog = document.querySelector("#screenDetailDialog");

const screenDetailTitle = document.querySelector("#screenDetailTitle");

const screenDetailBody = document.querySelector("#screenDetailBody");

const screenDetailClose = document.querySelector("#screenDetailClose");

const bottomNav = document.querySelector("#bottomNav");

const sectionTabs = document.querySelector("#sectionTabs");

const appViewSections = [...document.querySelectorAll("[data-view]")];

const screenGrid = document.querySelector("#screenGrid");

const screenCount = document.querySelector("#screenCount");

const officialShelf = document.querySelector("#officialShelf");

const merchShelf = document.querySelector("#merchShelf");

const merchGrid = document.querySelector("#merchGrid");

const merchCount = document.querySelector("#merchCount");

const screenMore = document.querySelector("#screenMore");

const searchMore = document.querySelector("#searchMore");

const merchMore = document.querySelector("#merchMore");

const themeControl = document.querySelector("#themeControl");

const toTopButton = document.querySelector("#toTopButton");

let activeView = "music";

let screenFilter = "";

let merchFilter = "";

let officialCategoryFilter = "";

let themeMode = localStorage.getItem(themeStorageKey);

if (!['light', 'dark'].includes(themeMode)) themeMode = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

let screenVisibleRows = 3;

let searchVisibleRows = 3;

let merchVisibleRows = 3;

const sectionTabConfig = {
  music: [],
  screen: [
    { value: "iu-official", label: "IU Official" },
    { value: "program", label: "综艺" },
    { value: "music-stage", label: "打歌舞台" },
    { value: "concert-video", label: "演唱会" },
    { value: "tv", label: "电视剧" },
    { value: "film", label: "电影" },
  ],
  merch: [],
  search: [],
  profile: [],
};

const screenMeta = {
  "Perfect Crown": {
    zh: "完美王冠",
    roleZh: "成熙珠",
    description: "2026 年电视剧档案条目，IU 饰演成熙珠，人物关系和权力叙事更偏成熟剧集方向。",
    palette: ["#1b2038", "#9b6b5d", "#f8ead6"],
    image: "./assets/covers/perfect-crown-user.png",
  },
  "When Life Gives You Tangerines": {
    zh: "苦尽柑来遇见你",
    roleZh: "吴爱纯 / 梁金明",
    description: "Netflix 剧集，跨越岁月的济州人生故事。IU 一人分饰两代女性，把少女、母亲与时代命运串在一起。",
    palette: ["#173b31", "#f0a23b", "#fff2d4"],
    image: "https://contigo.com.br/media/uploads/2025/03/glm1kkzwoaaocpc.jpg",
  },
  "IU Concert: The Winning": {
    zh: "IU 演唱会：The Winning",
    roleZh: "本人 / 演唱会影像",
    description: "演唱会电影档案，记录 The Winning 时期舞台和现场演出，是音乐作品和影像档案的连接点。",
    palette: ["#141827", "#d6414f", "#fff5e3"],
    image: "./assets/covers/winning-user.jpg",
  },
  "IU Concert: The Golden Hour": {
    zh: "IU 演唱会：黄金时刻",
    roleZh: "本人 / 演唱会影像",
    description: "大型演唱会电影，集中呈现代表曲舞台、现场叙事和 UAENA 记忆，是歌手 IU 的关键影像档案。",
    palette: ["#1f1a13", "#d9a441", "#fff7df"],
    image: "./assets/covers/golden-hour-user.jpg",
  },
  Dream: {
    zh: "梦想",
    roleZh: "李素敏",
    description: "体育题材电影，IU 饰演纪录片导演李素敏，角色带有观察者、记录者和轻喜剧节奏。",
    palette: ["#172033", "#5aa3c7", "#f7ead2"],
    image: "./assets/covers/dream-poster-user.png",
  },
  Broker: {
    zh: "掮客",
    roleZh: "文素英",
    description: "是枝裕和执导电影，IU 饰演年轻母亲文素英。角色克制、复杂，是她电影表演的重要节点。",
    palette: ["#1d2930", "#8fa7a3", "#f8ead6"],
    image: "./assets/covers/broker-poster-user.png",
  },
  "Shades of the Heart": {
    zh: "无人之境",
    roleZh: "美英",
    description: "文艺电影档案，IU 饰演美英，整体气质安静、留白多，适合放在表演转型线里看。",
    palette: ["#20242d", "#b48b6a", "#f7ead2"],
  },
  Real: {
    zh: "真实",
    roleZh: "典礼引导员 / 客串",
    description: "电影客串条目，戏份不长，但属于 IU 电影参与档案的一部分。",
    palette: ["#121827", "#73798a", "#fff5e3"],
    image: "./assets/covers/real-poster-user.png",
  },
  "A Turtle's Tale 2: Sammy's Escape from Paradise": {
    zh: "萨米大冒险 2",
    roleZh: "Ella 韩语配音",
    description: "动画电影韩语配音条目，属于 IU 早期影视声音参与记录。",
    palette: ["#0f3b4a", "#5ab4c7", "#fff7df"],
  },
  "Hotel del Luna": {
    zh: "德鲁纳酒店",
    roleZh: "张满月",
    description: "奇幻爱情剧代表作，IU 饰演张满月。造型、角色层次和 OST 传播度都很高。",
    palette: ["#221728", "#9a65a8", "#fff0dd"],
    image: "./assets/covers/hotel-del-luna-ost-user.png",
  },
  Persona: {
    zh: "人格四重奏",
    roleZh: "IU / Eun / Han-na / Ji-eun",
    description: "短片合集剧集，IU 在不同导演的短片中尝试多面角色，是实验性较强的影像档案。",
    palette: ["#2a1821", "#cc6f7b", "#fff1df"],
    image: "./assets/covers/persona-poster-user.png",
  },
  "My Mister": {
    zh: "我的大叔",
    roleZh: "李至安",
    description: "现实题材代表剧，IU 饰演李至安。角色压抑、坚韧，是大众评价很高的表演节点。",
    palette: ["#192229", "#6f7f84", "#f7ead2"],
    image: "https://image.tmdb.org/t/p/original/gE9tZDycsA31wvtzUcDWVk6Nf7t.jpg",
  },
  "Moon Lovers: Scarlet Heart Ryeo": {
    zh: "步步惊心：丽",
    roleZh: "高夏珍 / 解树",
    description: "古装穿越爱情剧，IU 饰演现代人高夏珍与高丽少女解树，关联多首热门 OST 记忆。",
    palette: ["#2b1823", "#b65c6d", "#fff1dd"],
    image: "https://image.tmdb.org/t/p/w780/jPKWlnvhJg0Yxw5poJbr2UjjKQx.jpg",
  },
  "The Producers": {
    zh: "制作人",
    roleZh: "Cindy",
    description: "职场喜剧剧集，IU 饰演顶级歌手 Cindy，角色与偶像产业观察紧密相关。",
    palette: ["#182038", "#6a8dd6", "#eef4ff"],
  },
  "Bel Ami": {
    zh: "漂亮男人",
    roleZh: "金普通",
    description: "浪漫喜剧剧集，IU 饰演金普通，角色明亮直接，属于早期主演剧集档案。",
    palette: ["#301d25", "#d98a95", "#fff4e7"],
  },
  "You Are the Best!": {
    zh: "最佳李纯信",
    roleZh: "李纯信",
    description: "家庭成长剧，IU 首次担任长篇剧主演之一，围绕梦想、家庭和自我证明展开。",
    palette: ["#1e2b22", "#86a66d", "#f7ead2"],
  },
  "Dream High": {
    zh: "Dream High",
    roleZh: "金必淑",
    description: "校园音乐剧集，IU 饰演金必淑，是她早期演员身份被更多观众看见的作品。",
    palette: ["#172033", "#d9a441", "#fff5e3"],
    image: "https://i0.wp.com/iutsc.com/wp-content/uploads/2024/03/2011-Dream-High-Poster.jpg?resize=952%2C1333&ssl=1",
  },
  "Dream High 2": {
    zh: "Dream High 2",
    roleZh: "金必淑 / 客串",
    description: "延续 Dream High 世界观的客串条目，保留早期音乐校园剧关联。",
    palette: ["#172033", "#b98a3f", "#fff5e3"],
  },
  "Salamander Guru and The Shadows": {
    zh: "蝾螈道士和影子操作团",
    roleZh: "小偷智恩 / 客串",
    description: "情景喜剧客串条目，属于 IU 早期电视剧参与记录。",
    palette: ["#18251f", "#72a27a", "#fff5e3"],
  },
  "Hyori's Homestay (Season 1)": {
    zh: "孝利家民宿 第一季",
    roleZh: "固定成员 / 民宿职员",
    description: "高人气综艺，IU 以安静、真诚的日常感出演，强化了大众对她生活面貌的记忆。",
    palette: ["#17352f", "#d9a441", "#fff6df"],
    image: "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2017/06/29/c22177b1-3183-4a89-baab-50ff9733608c.jpg",
  },
  "Kim Yuna's Kiss & Cry": {
    zh: "金妍儿的 Kiss & Cry",
    roleZh: "参赛者",
    description: "花样滑冰竞技综艺，记录 IU 作为参赛者挑战舞台之外的身体表达。",
    palette: ["#162b42", "#9fc7e9", "#f2f8ff"],
  },
  "Welcome to the Show": {
    zh: "Welcome to the Show",
    roleZh: "本人",
    description: "综艺/节目出演条目，属于早期电视节目档案。",
    palette: ["#201a2b", "#b084cc", "#fff0f8"],
  },
  Heroes: {
    zh: "英雄豪杰",
    roleZh: "固定成员",
    description: "早期固定综艺出演，记录 IU 综艺感和大众曝光积累的起点之一。",
    palette: ["#2a1a1b", "#d85f63", "#fff2df"],
  },
};

const trackZh = {
  eight: "八",
  BBIBBI: "哔哔",
  Fate: "命运",
  "Lost Child": "迷路的孩子",
  "Ugly Duckling": "丑小鸭",
  "You Know": "不是吗",
  "Feel So Good": "感觉很好",
  "Every Sweet Day": "每个甜蜜日子",
  "Looking at You": "凝望",
  "Four Without Me": "除了我还有四个",
  "Graduation Day": "毕业的日子",
  "Face to Face": "面对面",
  Boo: "Boo",
  Pitiful: "可怜",
  "A Dreamer": "梦想者",
  "Love Attack": "爱情袭击",
  "Taking a Train": "乘火车",
  Marshmallow: "棉花糖",
  "Morning Tears": "清晨眼泪",
  "Heartbeating Date": "心动约会",
  "Good Day": "好日子",
  "Not Like This": "不是这样",
  "What I'm Doing Slow": "慢慢做的事",
  "The Night of the First Breakup": "初次离别的那晚",
  "In a Room Alone": "独自在房间里",
  "Merry Christmas Ahead": "提前圣诞快乐",
  "Only I Didn't Know": "只有我不知道的故事",
  "Cruel Fairytale": "残酷童话",
  Secret: "秘密",
  "You & I": "你和我",
  "Wallpaper Pattern": "墙纸纹样",
  "Sleeping Prince": "沉睡森林里的王子",
  "Holding a Star in My Heart": "心中寻找星星的孩子",
  "Everything's Alright": "一切都好",
  Teacher: "老师",
  "4AM": "凌晨四点",
  "L'Amant": "恋人",
  "Rain Drop": "雨滴",
  Nagging: "唠叨",
  Uncle: "叔叔",
  "Wisdom Tooth": "智齿",
  "Last Fantasy": "最后的幻想",
  "The Abandoned": "走失的小孩",
  Peach: "桃子",
  "Every End of the Day": "一天结束",
  "I Really Don't Like Her": "我真的不喜欢她",
  "The Red Shoes": "红舞鞋",
  "Modern Times": "摩登时代",
  "Bad Day": "糟糕的一天",
  "A Gloomy Clock": "忧郁时钟",
  Friday: "星期五见面",
  "My Old Story": "我的老故事",
  Flower: "花",
  "The Meaning of You": "你的意义",
  "Dreams in Summer Night": "夏夜之梦",
  Shoes: "新鞋",
  Zezé: "Zezé",
  "Twenty-Three": "二十三",
  "The Shower": "阵雨",
  "Red Queen": "红女王",
  Knees: "膝盖",
  Glasses: "眼镜",
  Heart: "心",
  "Twenty Three": "二十三",
  Dlwlrma: "此刻",
  "Can't Love You Anymore": "无法再爱你",
  "Jam Jam": "Jam Jam",
  "Black Out": "断片",
  "Full Stop": "句点",
  "Dear Name": "致名字",
  "Autumn Morning": "秋日早晨",
  "Secret Garden": "秘密花园",
  "Sleepless Rainy Night": "雨夜难眠",
  "Last Night Story": "昨晚的故事",
  "By the Stream": "溪边",
  "Everyday with You": "每天与你",
  Unlucky: "不走运",
  "The Visitor": "那个人",
  "Above the Time": "时间之外",
  Lullaby: "摇篮曲",
  Flu: "流感",
  Coin: "硬币",
  "Hi Spring Bye": "春天你好春天再见",
  Troll: "轮唱歌",
  "Empty Cup": "空杯",
  "Ah Puh": "啊噗",
  Epilogue: "尾声",
  Drama: "电视剧",
  "Next Stop": "下一站",
  "Winter Sleep": "冬眠",
  You: "你",
  "Love Letter": "情书",
  "I Stan U": "我会成为你的观众",
  "Red Sneakers": "红色运动鞋",
  "Never Ending Story": "未完的故事",
  "October 4th": "10月4日",
  "Last Scene": "最后一幕",
  "A Beautiful Person": "美人",
  "Square's Dream": "方块的梦",
  "Bye, Summer": "再见，夏天",
  "Unknown Planet": "未知星球",
  "Dear My Crazy Soulmate": "致我疯狂的灵魂伴侣",
  "12월 24일": "12月24日",
  "247": "247",
  "I Believe in Love": "我相信爱",
  "Ice Flower": "冰花",
  "Sea of Moonlight": "月光海",
  "Not Spring, Love, or Cherry Blossoms": "除了春天、爱情和樱花",
  Sogyeokdong: "昭格洞",
  "When Would It Be": "什么时候会是",
  Leon: "莱昂",
  "Love Story": "爱情故事",
  SoulMate: "灵魂伴侣",
  Fairytale: "童话",
  "First Winter": "第一个冬天",
  "Small Room": "小房间",
  Nakka: "坠落",
  "Mother Nature": "大自然",
  Ganadara: "GANADARA",
  "People Pt. 2": "人们 Pt.2",
  "Give You My Heart": "献上我的心",
  BBIBBI: "哔哔",
  Twenty: "二十岁",
  "Hold My Hand": "抓住我的手",
  "strawberry moon": "草莓月亮",
  "Pierrot Laughs at Us": "小丑看着我们笑",
  "Mamma Mia": "妈妈咪呀",
  "Darl+ing": "亲爱的",
  Hurt: "受伤",
  "Love Poem": "爱之诗",
  Palette: "调色盘",
  "Through the Night": "夜信",
  Blueming: "蓝色绽放",
  Celebrity: "名人",
  Lilac: "丁香花",
  "My Sea": "我的海",
  "Love Wins All": "爱终将胜利",
  Shopper: "购物者",
  Holssi: "蒲公英种子",
  "Shh..": "嘘",
  "Small Room": "小房间",
  "First Winter": "第一个冬天",
  "Fairy Tale": "童话",
  Fairytale: "童话",
  "Love Story": "爱情故事",
  "Mother Nature (H₂O)": "大自然",
  "Good Day": "好日子",
  "You & I": "你和我",
  "The Red Shoes": "红舞鞋",
  "Twenty-Three": "二十三",
  "Ending Scene": "结局",
  "Dear Name": "致名字",
  "Hotel del Luna": "德鲁纳酒店",
  "12월 24일 (December 24; D.ear Cover)": "12月24日",
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function trackCategory(track) {
  const text = `${track.title} ${track.release} ${track.type} ${track.source}`.toLowerCase();
  if (text.includes("ost") || text.includes("soundtrack")) return "ost";
  if (text.includes("翻唱") || text.includes("flower bookmark")) return "cover";
  if (/\b(feat|with|duet|collab)\b/i.test(text) || /,/.test(track.title) || /&/.test(track.title)) return "collab";
  if (track.version) return "version";
  if (track.iuCreationRole) return "creator";
  return "official";
}

function categoryLabel(value) {
  return {
    official: "正式发行",
    cover: "翻唱",
    collab: "合作 / 参与",
    ost: "OST",
    version: "版本 / 伴奏",
    creator: "IU 创作",
  }[value] || "作品";
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\s*-\s*lyrics\s*$/i, "")
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .replace(/\s*\[[^\]]*\]\s*$/g, "")
    .replace(/\s+/g, " ");
}

function searchQueryForTrack(track) {
  return (track.searchQuery || `IU ${track.title} ${track.originalArtist || ""}`).trim();
}

function directSearchUrl(base, query) {
  return base + encodeURIComponent(query);
}

function youtubeSearchLink(query) {
  return directSearchUrl("https://www.youtube.com/results?search_query=", query);
}

function bilibiliSearchLink(query) {
  return directSearchUrl("https://search.bilibili.com/all?keyword=", query);
}

function ensureTrackMediaLinks() {
  catalog.tracks.forEach((track) => {
    const queryText = searchQueryForTrack(track);
    track.audioLinks = {
      spotify: directSearchUrl("https://open.spotify.com/search/", queryText),
      youtubeMusic: directSearchUrl("https://music.youtube.com/search?q=", queryText),
      appleMusic: track.audioLinks?.appleMusic || directSearchUrl("https://music.apple.com/us/search?term=", queryText),
      melon: directSearchUrl("https://www.melon.com/search/total/index.htm?q=", queryText),
      bugs: directSearchUrl("https://music.bugs.co.kr/search/integrated?q=", queryText),
    };
    const existingVideos = Array.isArray(track.mv) ? track.mv : [];
    const videoKeys = new Set(existingVideos.map((video) => `${video.type}-${video.title}`));
    const requiredVideos = [
      {
        title: `${track.title} Official MV / Audio`,
        year: track.year,
        type: "官方 MV / Audio",
        notes: "优先查找官方频道发布的 MV、Official Audio 或 Lyrics Video。",
        youtube: youtubeSearchLink(`IU ${track.title} official MV OR official audio`),
        bilibili: bilibiliSearchLink(`IU ${track.title} 官方 MV`),
      },
      {
        title: `${track.title} Music Show Stage`,
        year: track.year,
        type: "打歌舞台",
        notes: "搜索 KBS / MBC / SBS / Mnet 等公开打歌或回归舞台。",
        youtube: youtubeSearchLink(`IU ${track.title} music show stage KBS MBC SBS Mnet`),
        bilibili: bilibiliSearchLink(`IU ${track.title} 打歌舞台`),
      },
      {
        title: `${track.title} Live Clip`,
        year: track.year,
        type: "Live / Concert",
        notes: "搜索官方 Live Clip、演唱会舞台或节目现场。",
        youtube: youtubeSearchLink(`IU ${track.title} live concert official`),
        bilibili: bilibiliSearchLink(`IU ${track.title} 现场 演唱会`),
      },
    ];
    requiredVideos.forEach((video) => {
      const key = `${video.type}-${video.title}`;
      if (!videoKeys.has(key)) {
        existingVideos.push(video);
        videoKeys.add(key);
      }
    });
    track.mv = existingVideos;
  });
}

function yearRank(value) {
  const match = String(value || "").match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function sortByNewest(a, b) {
  return yearRank(b.year) - yearRank(a.year) || String(a.title).localeCompare(String(b.title), "zh-Hans-CN");
}

function trackChineseTitle(track) {
  if (track.zh) return track.zh;
  if (trackZh[track.title]) return trackZh[track.title];
  const plain = String(track.title || "").replace(/\s*\([^)]*\)/g, "").trim();
  return trackZh[plain] || "";
}

function cardTextClass(text = "") {
  const length = String(text).replace(/\s+/g, "").length;
  if (length > 54) return "isTextLong";
  if (length > 34) return "isTextMedium";
  return "isTextShort";
}

function trackIntro(track) {
  const zh = trackChineseTitle(track);
  const category = categoryLabel(trackCategory(track));
  const role = track.iuCreationRole ? `IU 参与：${track.iuCreationRole}` : `作词：${track.lyrics || "资料待补"}`;
  return `${track.year} 年 ${category}，收录于《${track.release}》。${role}。`;
}

function uniqueTracksByTitle(titles) {
  return titles
    .map((title) => catalog.tracks.find((track) => normalizeKey(track.title) === normalizeKey(title) || normalizeKey(track.title).startsWith(normalizeKey(title))))
    .filter(Boolean)
    .filter((track, index, array) => index === array.findIndex((candidate) => normalizeKey(candidate.title) === normalizeKey(track.title)));
}

function musicStageItems() {
  return uniqueTracksByTitle([
    "Good Day",
    "You & I",
    "The Red Shoes",
    "Friday",
    "Twenty-Three",
    "Palette",
    "Through the Night",
    "BBIBBI",
    "Blueming",
    "Celebrity",
    "Lilac",
    "Coin",
    "strawberry moon",
    "Love Wins All",
    "Shopper",
    "Holssi",
  ]).map((track) => ({
    id: `stage-${track.id}`,
    title: `${track.title} Music Show Stage`,
    zh: `${trackChineseTitle(track) || track.title} 打歌舞台`,
    year: track.year,
    type: "打歌舞台 / 音乐节目",
    role: "Performer",
    notes: "聚合官方电视台、节目频道和公开舞台搜索入口，方便继续补精确视频。",
    image: track.cover?.image,
    source: youtubeSearchLink(`IU ${track.title} music show stage official KBS MBC SBS Mnet`),
    kind: "music-stage",
  }));
}

function concertVideoItems() {
  const userConcertLinks = {
    goldenHour: "https://www.bilibili.com/video/BV1J6Y1zbES3/",
    hereh: "https://www.bilibili.com/video/BV1CM4NziEnu/",
    lovePoem: "https://www.bilibili.com/video/BV1DbcRevEXv/",
    theWinning: "https://www.bilibili.com/video/BV1dNhyz1Ehm/",
  };
  return [
    {
      id: "concert-golden-hour-video",
      title: "IU Concert: The Golden Hour",
      zh: "IU 演唱会：黄金时刻",
      year: 2023,
      type: "演唱会 / 官方影像",
      role: "Performer",
      notes: "集中整理 Golden Hour 演唱会电影、官方片段、舞台剪辑和公开预告入口。",
      image: screenMeta["IU Concert: The Golden Hour"]?.image || "",
      source: youtubeSearchLink("IU The Golden Hour concert official trailer live clip"),
      resourceLinks: [{ label: "Bilibili 全场中字", url: userConcertLinks.goldenHour }],
      kind: "concert-video",
    },
    {
      id: "concert-hereh-video",
      title: "IU HEREH World Tour Concert",
      zh: "IU HEREH 世界巡回演唱会",
      year: 2024,
      type: "演唱会 / World Tour",
      role: "Performer",
      notes: "IU 2024 世界巡回演唱会官方影像入口，按巡演公开物料整理。",
      image: "https://static.wikia.nocookie.net/kpop/images/0/0f/IU_HEREH_World_Tour_main_poster_1.png/revision/latest/scale-to-width-down/1200?cb=20240805175546",
      source: youtubeSearchLink("IU HEREH World Tour official concert"),
      resourceLinks: [{ label: "Bilibili 全场中字", url: userConcertLinks.hereh }],
      kind: "concert-video",
    },
    {
      id: "concert-love-poem-video",
      title: "IU Love Poem Concert",
      zh: "IU Love Poem 演唱会",
      year: 2019,
      type: "演唱会 / Live clips",
      role: "Performer",
      notes: "整理 Love Poem 演唱会相关官方片段和公开视频入口。",
      image: "https://cdnticket.melon.co.kr/resource/image/upload/marketing/2019/10/20191021135954e0e7b6c6-ee01-4dff-8c75-d3c699021c22.png",
      source: youtubeSearchLink("IU Love Poem concert official live clip"),
      resourceLinks: [{ label: "Bilibili 全场中字", url: userConcertLinks.lovePoem }],
      kind: "concert-video",
    },
    {
      id: "concert-the-winning-bilibili-video",
      title: "IU Concert: The Winning Live",
      zh: "IU 演唱会：The Winning 全场",
      year: 2024,
      type: "演唱会 / 官方蓝光",
      role: "Performer",
      notes: "The Winning 演唱会官方蓝光全场入口，单独保留为演唱会视频条目。",
      image: screenMeta["IU Concert: The Winning"]?.image || "",
      source: youtubeSearchLink("IU The Winning concert official full concert"),
      resourceLinks: [{ label: "Bilibili 官方蓝光全场", url: userConcertLinks.theWinning }],
      kind: "concert-video",
    },
  ];
}

function screenItems() {
  const screen = catalog.screen || {};
  return [
    ...(screen.programs || []).map((item) => ({ ...item, kind: "program" })),
    ...musicStageItems(),
    ...concertVideoItems(),
    ...(screen.tv || []).map((item) => ({ ...item, kind: "tv" })),
    ...(screen.films || []).filter((item) => !/concert/i.test(item.title)).map((item) => ({ ...item, kind: "film" })),
  ]
    .map((item) => ({ ...item, meta: screenMeta[item.title] || {} }))
    .sort((a, b) => yearRank(b.year) - yearRank(a.year) || String(a.title).localeCompare(String(b.title), "zh-Hans-CN"));
}

function screenKindLabel(kind) {
  return {
    program: "综艺",
    "music-stage": "打歌舞台",
    "concert-video": "演唱会",
    tv: "电视剧",
    film: "电影",
  }[kind] || "影视";
}

function screenSearchLinks(item) {
  const queryText = ('IU ' + item.title + ' ' + (item.meta?.zh || item.zh || '')).trim();
  const query = encodeURIComponent(queryText);
  return [
    { label: "YouTube 官方/舞台", url: 'https://www.youtube.com/results?search_query=' + query + '%20official%20stage%20trailer' },
    { label: "Google", url: 'https://www.google.com/search?q=' + query },
    { label: "Bilibili", url: 'https://search.bilibili.com/all?keyword=' + query },
    { label: "百度", url: 'https://www.baidu.com/s?wd=' + query },
    { label: "豆瓣", url: 'https://www.douban.com/search?q=' + query },
  ];
}

const screenPanLinks = {
  "You Are the Best!": { label: "百度网盘：最佳李顺心", url: "https://pan.baidu.com/s/1_Y_EvXCjWe8_kv71O-hS8Q?pwd=0516", code: "0516" },
  "My Mister": { label: "百度网盘：我的大叔 4K", url: "https://pan.baidu.com/s/1AOsb-6kTkf8x65q_TqzaIA?pwd=0516", code: "0516" },
  Persona: { label: "百度网盘：人格四重奏", url: "https://pan.baidu.com/s/1gUXdJI9JRO8BksFw2HvP9A?pwd=0516", code: "0516" },
  "When Life Gives You Tangerines": { label: "百度网盘：苦尽甘来遇见你", url: "https://pan.baidu.com/s/1c5AfyHiKQzvMgL4uN6roNA?pwd=0516", code: "0516" },
  "Hotel del Luna": { label: "百度网盘：德鲁纳酒店 4K", url: "https://pan.baidu.com/s/1wuuSOx92C9HOjJseGPX4JA?pwd=0516", code: "0516" },
  "Moon Lovers: Scarlet Heart Ryeo": { label: "百度网盘：步步惊心：丽", url: "https://pan.baidu.com/s/1xUc-a1C5w1TdxNTl1G2LWw?pwd=0516", code: "0516" },
  "Dream High": { label: "百度网盘：追梦高中", url: "https://pan.baidu.com/s/1TZN0MDWMlrV1UBXB7kNn1Q?pwd=0516", code: "0516" },
  "The Producers": { label: "百度网盘：制作人", url: "https://pan.baidu.com/s/1BQjPk2ovm_kYoGv01DbPSw?pwd=0516", code: "0516" },
  Broker: { label: "百度网盘：掮客", url: "https://pan.baidu.com/s/1FUPLciOj43JH8NHTyt-hdA?pwd=0516", code: "0516" },
  Dream: { label: "百度网盘：梦想", url: "https://pan.baidu.com/s/1vkcZp9lDWtjLNkq8FEV85Q?pwd=0516", code: "0516" },
};

function screenResourceLinks(item) {
  const pan = screenPanLinks[item.title];
  return [
    ...(item.resourceLinks || []),
    ...(pan ? [{ label: `${pan.label}（提取码 ${pan.code}）`, url: pan.url }] : []),
  ];
}

function screenCoverStyle(item) {
  const colors = item.meta?.palette || ["#172033", "#d6414f", "#fff5e3"];
  const image = screenCoverImage(item);
  if (image) {
    return `background: linear-gradient(135deg, ${colors[0]}, ${colors[1]}); background-image: url('${image}'); background-size: cover; background-repeat: no-repeat; background-position: center; color: ${colors[2]};`;
  }
  return `background: linear-gradient(135deg, ${colors[0]}, ${colors[1]}); color: ${colors[2]};`;
}

function screenCoverImage(item) {
  return window.IU_SCREEN_COVERS?.[item.title] || item.meta?.image || item.episodeImage || item.image || "";
}

function screenCardLayout(item) {
  if (item.kind === "concert" || item.kind === "music-show") return "isPosterLayout";
  if (item.kind === "palette" || item.kind === "variety") return "isWideLayout";
  return "isClassicLayout";
}

function gridColumnCount(element, fallback = 3) {
  if (!element) return fallback;
  const columns = getComputedStyle(element).gridTemplateColumns;
  if (!columns || columns === "none") return fallback;
  return Math.max(1, columns.split(" ").filter(Boolean).length);
}

function visibleCardLimit(element, rows, fallbackColumns) {
  return gridColumnCount(element, fallbackColumns) * rows;
}

function updateMoreButton(button, visibleCount, totalCount) {
  if (!button) return;
  const remaining = Math.max(0, totalCount - visibleCount);
  button.hidden = remaining === 0;
  button.textContent = remaining ? `显示更多 · 还有 ${remaining} 项` : "已显示全部";
}

function officialCategories() {
  return (window.IU_YOUTUBE_OFFICIAL?.categories || []).map(category => ({
    ...category,
    cover: window.IU_OFFICIAL_COVERS?.[category.cover] || category.cover,
    videos: category.videos.map(video => ({ ...video, thumbnail: window.IU_OFFICIAL_COVERS ? (window.IU_OFFICIAL_COVERS[video.thumbnail] || 'assets/icons/tv.svg') : video.thumbnail })),
  }));
}

function formatVideoDuration(seconds) {
  const value = Number(seconds) || 0;
  if (!value) return "";
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remaining = value % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
    : `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function formatVideoViews(views) {
  const value = Number(views) || 0;
  if (!value) return "";
  if (value >= 100000000) return `${(value / 100000000).toFixed(1).replace(/\.0$/, "")}亿次观看`;
  if (value >= 10000) return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}万次观看`;
  return `${value.toLocaleString("zh-CN")}次观看`;
}

function renderOfficialShelf() {
  const categories = officialCategories();
  officialShelf.innerHTML = categories
    .map(
      (category) => `
        <button class="officialCategoryCard ${category.id === officialCategoryFilter ? "is-active" : ""}" type="button"
          data-official-category="${escapeHtml(category.id)}"
          style="background-image: linear-gradient(180deg, rgba(8, 12, 22, 0.06), rgba(8, 12, 22, 0.82)), url('${category.cover}')">
          <span class="officialCategoryCard__copy">
            <strong>${escapeHtml(category.title)}</strong>
            <small>${escapeHtml(category.zh)}</small>
            <em>${category.videoCount} 个视频</em>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderOfficialVideos() {
  officialShelf.hidden = false;
  renderOfficialShelf();
  const category = officialCategories().find((item) => item.id === officialCategoryFilter);
  if (!category) {
    screenCount.textContent = "请选择分类";
    screenGrid.innerHTML = `<div class="empty selectionPrompt">请选择上方的 IU Official 分类。</div>`;
    screenMore.hidden = true;
    return;
  }

  const visible = category.videos.slice(0, visibleCardLimit(screenGrid, screenVisibleRows, 3));
  screenCount.textContent = `${visible.length} / ${category.videos.length} videos`;
  screenGrid.innerHTML = visible
    .map((video) => {
      const duration = formatVideoDuration(video.duration);
      const views = formatVideoViews(video.views);
      return `
        <a class="officialVideoCard" href="${video.url}" target="_blank" rel="noreferrer" aria-label="打开 ${escapeHtml(video.title)}">
          <span class="officialVideoCard__cover">
            <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy" />
            ${duration ? `<small>${duration}</small>` : ""}
          </span>
          <span class="officialVideoCard__body">
            <strong>${escapeHtml(video.title)}</strong>
            <small>${escapeHtml(category.title)}${views ? ` · ${views}` : ""}</small>
          </span>
        </a>
      `;
    })
    .join("");
  updateMoreButton(screenMore, visible.length, category.videos.length);
}

function renderScreen() {
  if (!screenFilter) {
    officialShelf.hidden = true;
    officialShelf.innerHTML = "";
    screenCount.textContent = "请选择分类";
    screenGrid.innerHTML = `<div class="empty selectionPrompt">请选择顶部影视分类。</div>`;
    screenMore.hidden = true;
    return;
  }
  if (screenFilter === "iu-official") {
    renderOfficialVideos();
    return;
  }
  officialShelf.hidden = true;
  officialShelf.innerHTML = "";
  const all = screenItems().slice().sort(sortByNewest);
  const filtered = all.filter((item) => item.kind === screenFilter);
  const visible = filtered.slice(0, visibleCardLimit(screenGrid, screenVisibleRows, 3));
  screenCount.textContent = `${filtered.length} / ${all.length} items`;
  screenGrid.innerHTML =
    visible
      .map((item) => {
        const links = screenSearchLinks(item);
        const resourceLinks = screenResourceLinks(item);
        const hasCover = Boolean(screenCoverImage(item));
        return `
          <article class="screenCard ${screenCardLayout(item)}">
            <div class="screenCard__cover ${hasCover ? "" : "isMissingCover"}" style="${screenCoverStyle(item)}">
            </div>
            <div class="screenCard__body">
              <span>${screenKindLabel(item.kind)} · ${escapeHtml(item.type || "")}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <small class="zhLine">${item.meta?.zh || item.zh ? escapeHtml(item.meta?.zh || item.zh) : escapeHtml(item.title)}</small>
              <p><strong>身份：</strong>${escapeHtml(item.meta?.roleZh || item.role || "Host / Performer")}</p>
              <p>${escapeHtml(item.meta?.description || item.notes || "中文介绍待补。")}</p>
              <div class="trackLinks">
                ${links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
                ${resourceLinks.map((link) => `<a class="trackLinkButton--primary" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
                ${item.source ? `<a href="${item.source}" target="_blank" rel="noreferrer">来源</a>` : ""}
                <button class="trackLinkButton trackLinkButton--primary" type="button" data-screen-detail="${escapeHtml(item.id || item.title)}">详细信息</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("") || `<div class="empty">这个分类暂时没有条目。</div>`;
  updateMoreButton(screenMore, visible.length, filtered.length);
}

function merchItems() {
  return (window.IU_MERCH?.categories || []).flatMap((category) =>
    category.items.map((item) => ({ ...item, categoryId: category.id, categoryTitle: category.title })),
  );
}

function renderMerchShelf() {
  const categories = window.IU_MERCH?.categories || [];
  merchShelf.innerHTML = categories
    .map((category) => {
      const cover = category.items.find((item) => item.cover)?.cover || "";
      return `
        <button class="officialCategoryCard merchCategoryCard ${category.id === merchFilter ? "is-active" : ""}" type="button"
          data-merch-category="${escapeHtml(category.id)}"
          style="background-image: linear-gradient(180deg, rgba(8, 12, 22, 0.04), rgba(8, 12, 22, 0.82)), url('${cover}')">
          <span class="officialCategoryCard__copy">
            <strong>${escapeHtml(category.title)}</strong>
            <small>Bilibili 开箱收藏</small>
            <em>${category.items.length} 个视频</em>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderMerch() {
  const all = merchItems();
  renderMerchShelf();
  if (!merchFilter) {
    merchCount.textContent = "请选择分类";
    merchGrid.innerHTML = `<div class="empty selectionPrompt">请选择上方的开箱分类。</div>`;
    merchMore.hidden = true;
    return;
  }
  const filtered = all.filter((item) => item.categoryId === merchFilter);
  const visible = filtered.slice(0, visibleCardLimit(merchGrid, merchVisibleRows, 3));
  merchCount.textContent = `${visible.length} / ${filtered.length} videos`;
  merchGrid.innerHTML =
    visible
      .map(
        (item) => `
        <a class="merchCard ${cardTextClass(item.title + item.description)}" href="${item.url}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(item.title)}">
          <span class="merchCard__cover">
            <img src="${item.cover}" alt="${escapeHtml(item.title)}" loading="lazy" />
            ${item.duration ? `<small>${escapeHtml(item.duration)}</small>` : ""}
          </span>
          <div class="merchCard__body">
            <span>${escapeHtml(item.categoryTitle)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description && item.description !== "-" ? item.description : "Bilibili 开箱 / 收藏展示入口。")}</p>
          </div>
        </a>
      `,
      )
      .join("") || `<div class="empty">这个开箱分类暂时没有条目。</div>`;
  updateMoreButton(merchMore, visible.length, filtered.length);
}

function renderSectionTabs() {
  const tabs = sectionTabConfig[activeView] || [];
  sectionTabs.hidden = !tabs.length;
  if (!tabs.length) {
    sectionTabs.innerHTML = "";
    return;
  }
  const current = activeView === "merch" ? merchFilter : screenFilter;
  sectionTabs.innerHTML = tabs
    .map(
      (tab) => `
        <button class="${tab.value === current ? "is-active" : ""}" type="button" data-section-filter="${tab.value}">
          ${escapeHtml(tab.label)}
        </button>
      `,
    )
    .join("");
}

function setView(view) {
  activeView = view;
  document.body.dataset.activeView = view;
  appViewSections.forEach((section) => {
    section.classList.toggle("is-active-view", section.dataset.view === view);
  });
  bottomNav.querySelectorAll("[data-app-view]").forEach((button, index) => {
    button.classList.toggle("is-active", button.dataset.appView === view);
    if (button.dataset.appView === view) bottomNav.style.setProperty("--active-index", index);
  });
  if (view === "screen") renderScreen();
  if (view === "merch") renderMerch();
  if (view === "search") renderGlobalSearch();
  renderSectionTabs();
  document.body.classList.add("app-ready");
}

function applyTheme(mode = themeMode) {
  themeMode = mode;
  localStorage.setItem(themeStorageKey, mode);
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  document.body.classList.toggle("theme-light", mode === "light" || (mode === "system" && prefersLight));
  themeControl.querySelectorAll("[data-theme]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.theme === mode);
  });
}

function localMusicTracks() {
  const localTracks = Array.isArray(window.IU_LOCAL_TRACKS) ? window.IU_LOCAL_TRACKS : [];
  return localTracks.map((track) => ({
    ...track,
    year: track.year || track.category || "本地",
    type: track.type || track.category || "本地专辑",
    language: track.language || "资料待补",
    length: "",
    version: "",
    mv: [],
    lyrics: "",
    music: "",
    arrangement: "",
    iuCreationRole: "",
    source: "",
    cover: {
      image: track.cover,
      colors: ["#efe8ff", "#d7c7f7", "#3b245f"],
      initials: "IU",
    },
  }));
}

function activeMusicTracks() {
  const localTracks = localMusicTracks();
  return localTracks.length ? localTracks : catalog.tracks;
}

let globalSearchIndex;

function globalSearchItems() {
  if (globalSearchIndex) return globalSearchIndex;
  const trackItems = activeMusicTracks().map((track) => ({
    id: `track-${track.id}`,
    kind: "music",
    title: track.title,
    zh: trackChineseTitle(track),
    subtitle: `${track.year} · ${track.release} · ${categoryLabel(trackCategory(track))}`,
    description: trackIntro(track),
    image: track.cover?.image,
    searchText: [
      track.title,
      track.originalTitle,
      trackChineseTitle(track),
      track.release,
      track.year,
      track.type,
      track.language,
      track.lyrics,
      track.music,
      track.originalArtist,
    ].join(" "),
    trackId: track.id,
  }));
  const releases = window.IU_LOCAL_ALBUMS?.length ? window.IU_LOCAL_ALBUMS.map(album => ({
    ...album, year: album.publishTime ? new Date(album.publishTime).getUTCFullYear() : '',
    type: album.category, track_count: album.audioCount, cover: { image: album.cover },
  })) : catalog.releases;
  const releaseItems = releases
    .filter((release) => release.title !== "Collaborations, Covers & Specials")
    .map((release) => ({
      id: `release-${release.id || release.title}`,
      kind: "release",
      title: release.title,
      zh: "",
      subtitle: `${release.year} · ${release.type} · ${release.track_count} 首`,
      description: `${release.type || "发行"} · ${release.track_count || 0} 首曲目`,
      image: release.cover?.image,
      searchText: [release.title, release.year, release.type, release.language, release.cover?.provider].join(" "),
      releaseTitle: release.title,
      albumId: release.id,
    }));
  const screenSearchItems = screenItems().map((item) => ({
    id: `screen-${item.id || item.title}`,
    kind: "screen",
    title: item.title,
    zh: item.meta?.zh || item.zh || "",
    subtitle: `${item.year} · ${screenKindLabel(item.kind)} · ${item.type || ""}`,
    description: item.meta?.description || item.notes || "影视/舞台档案",
    image: screenCoverImage(item),
    searchText: [
      item.title,
      item.meta?.zh,
      item.zh,
      item.year,
      item.type,
      screenKindLabel(item.kind),
      item.role,
      item.meta?.roleZh,
      item.notes,
      item.meta?.description,
    ].join(" "),
    screenKind: item.kind,
  }));
  const merchSearchItems = merchItems().map((item) => ({
    id: `merch-${item.id}`,
    kind: "merch",
    title: item.title,
    zh: "",
    subtitle: `${item.categoryTitle}${item.duration ? ` · ${item.duration}` : ""}`,
    description: item.description && item.description !== "-" ? item.description : "Bilibili 开箱 / 收藏展示入口。",
    image: item.cover,
    searchText: [item.title, item.categoryTitle, item.owner, item.description, item.bvid].join(" "),
    merchCategory: item.categoryId,
    url: item.url,
  }));
  const officialVideoItems = officialCategories().flatMap((category) =>
    category.videos.map((video) => ({
      id: `official-${video.id}`,
      kind: "official-video",
      title: video.title,
      zh: category.zh,
      subtitle: `IU Official · ${category.title}`,
      description: [formatVideoDuration(video.duration), formatVideoViews(video.views)].filter(Boolean).join(" · ") || "IU 官方频道视频",
      image: video.thumbnail,
      searchText: [video.title, category.title, category.zh, "IU Official"].join(" "),
      url: video.url,
    })),
  );
  globalSearchIndex = [...trackItems, ...releaseItems, ...screenSearchItems, ...officialVideoItems, ...merchSearchItems].map(item => ({
    ...item, normalizedSearch: normalizeKey(item.searchText), normalizedTitle: normalizeKey(item.title),
  }));
  return globalSearchIndex;
}

function globalKindLabel(kind) {
  return {
    music: "音乐",
    release: "发行",
    screen: "影视 / 舞台",
    "official-video": "IU Official",
    merch: "开箱",
  }[kind] || "结果";
}

function renderGlobalSearch() {
  const query = normalizeKey(globalSearchInput?.value || "");
  const type = globalSearchType?.value || "all";
  searchPage?.classList.toggle("has-search", Boolean(query) || type !== "all");
  if (!query && type === "all") {
    globalSearchCount.textContent = "请搜索或筛选";
    globalSearchResults.innerHTML = `<div class="empty selectionPrompt">输入关键词，或选择一个搜索范围。</div>`;
    searchMore.hidden = true;
    return;
  }
  const items = globalSearchItems().filter((item) => {
    if (type !== "all" && item.kind !== type) return false;
    if (!query) return true;
    return query.split(/\s+/).filter(Boolean).every(term => item.normalizedSearch.includes(term));
  }).sort((a, b) => Number(b.normalizedTitle === query) - Number(a.normalizedTitle === query) || Number(b.normalizedTitle.startsWith(query)) - Number(a.normalizedTitle.startsWith(query)));
  const visible = items.slice(0, visibleCardLimit(globalSearchResults, searchVisibleRows, 3));
  globalSearchCount.textContent = `${items.length} results`;
  globalSearchResults.innerHTML =
    visible
      .map(
        (item) => `
        <article class="globalResult ${item.image ? "hasImage" : ""}">
          <div class="globalResult__cover" style="${item.image ? `background-image: linear-gradient(180deg, rgba(9, 13, 24, 0.04), rgba(9, 13, 24, 0.72)), url('${item.image}')` : ""}">
            <span>${escapeHtml(globalKindLabel(item.kind))}</span>
          </div>
          <div class="globalResult__body">
            <span>${escapeHtml(item.subtitle)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            ${item.zh ? `<small>中文：${escapeHtml(item.zh)}</small>` : ""}
            <p>${escapeHtml(item.description)}</p>
            <div class="trackLinks">
              ${
                item.kind === "music"
                  ? `<button class="trackLinkButton trackLinkButton--primary" type="button" data-detail-key="${escapeHtml(item.trackId)}">歌曲详情</button>`
                  : ""
              }
              ${
                item.kind === "release"
                  ? `<button class="trackLinkButton trackLinkButton--primary" type="button" data-search-release="${escapeHtml(item.releaseTitle)}" data-album-id="${escapeHtml(item.albumId || '')}">查看专辑</button>`
                  : ""
              }
              ${
                item.kind === "screen"
                  ? `<button class="trackLinkButton trackLinkButton--primary" type="button" data-search-screen="${escapeHtml(item.screenKind)}">查看分类</button>`
                  : ""
              }
              ${
                item.kind === "merch"
                  ? `<button class="trackLinkButton trackLinkButton--primary" type="button" data-search-merch="${escapeHtml(item.merchCategory)}">查看开箱</button><a href="${item.url}" target="_blank" rel="noreferrer">打开 Bilibili</a>`
                  : ""
              }
              ${item.kind === "official-video" ? `<a class="trackLinkButton trackLinkButton--primary" href="${item.url}" target="_blank" rel="noreferrer">打开 YouTube</a>` : ""}
            </div>
          </div>
        </article>
      `,
      )
      .join("") || `<div class="empty">没有找到匹配内容，换个关键词试试。</div>`;
  updateMoreButton(searchMore, visible.length, items.length);
}

function showDialogSafely(dialog) {
  if (!dialog) return;
  dialog.scrollTop = 0;
  if (dialog.open) return;
  document.body.classList.add("dialog-open");
  try {
    dialog.showModal();
  } catch {
    dialog.setAttribute("open", "");
  }
}

function detailRow(label, value) {
  return value
    ? `<div class="detailRow"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
    : "";
}

function renderDetailLinks(title, links) {
  return `
    <div class="detailLinkGroup">
      <h3>${escapeHtml(title)}</h3>
      <div class="trackLinks">
        ${links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
      </div>
    </div>
  `;
}

function openScreenDetail(item) {
  const image = screenCoverImage(item);
  const resourceLinks = screenResourceLinks(item);
  const links = [
    ...screenSearchLinks(item),
    ...resourceLinks,
    ...(item.source ? [{ label: "原始资料 / 视频入口", url: item.source }] : []),
  ];
  screenDetailTitle.textContent = item.title;
  screenDetailBody.innerHTML = `
    <div class="detailHero ${image ? "hasImage" : "detailHero--missing"}" style="${screenCoverStyle(item)}">
      <span>${escapeHtml(image ? screenKindLabel(item.kind) : "封面待补")}</span>
      <strong>${escapeHtml(item.meta?.zh || item.zh || item.title)}</strong>
    </div>
    <div class="detailGrid">
      ${detailRow("分类", screenKindLabel(item.kind))}
      ${detailRow("原名", item.title)}
      ${detailRow("中文", item.meta?.zh || item.zh)}
      ${detailRow("发布时间", item.year)}
      ${detailRow("类型", item.type)}
      ${detailRow("身份", item.meta?.roleZh || item.role || "Host / Performer")}
      ${detailRow("网盘资源", resourceLinks.length ? "已添加，提取码 0516" : "")}
      ${detailRow("封面状态", image ? "已设置对应封面" : "未找到可确认封面，等待补图")}
    </div>
    <p class="lyricsNote">${escapeHtml(item.meta?.description || item.notes || "中文介绍待补。")}</p>
    ${renderDetailLinks("视频 / 资料入口", links)}
  `;
  showDialogSafely(screenDetailDialog);
}

let searchInputTimer;

[globalSearchInput, globalSearchType].forEach((control) => {
  control?.addEventListener("input", () => {
    searchVisibleRows = 3;
    clearTimeout(searchInputTimer);
    searchInputTimer = setTimeout(renderGlobalSearch, 120);
  });
  control?.addEventListener("change", () => {
    if (control === globalSearchInput) return;
    clearTimeout(searchInputTimer);
    searchVisibleRows = 3;
    renderGlobalSearch();
  });
});

globalSearchResults?.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail-key]");
  const releaseButton = event.target.closest("[data-search-release]");
  const screenButton = event.target.closest("[data-search-screen]");
  const merchButton = event.target.closest("[data-search-merch]");
  if (detailButton) {
    const track = activeMusicTracks().find((item) => String(item.id) === detailButton.dataset.detailKey);
    if (track) {
      setView('music');
      document.querySelector('#musicAppFrame').contentWindow.postMessage({ type: 'uaena-open-track', id: track.id }, location.origin);
    }
    return;
  }
  if (releaseButton) {
    setView("music");
    document.querySelector('#musicAppFrame').contentWindow.postMessage({ type: 'uaena-open-album', id: releaseButton.dataset.albumId, title: releaseButton.dataset.searchRelease }, location.origin);
    return;
  }
  if (screenButton) {
    setView("screen");
    screenFilter = screenButton.dataset.searchScreen;
    renderScreen();
    renderSectionTabs();
    document.querySelector("#screen").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (merchButton) {
    setView("merch");
    merchFilter = merchButton.dataset.searchMerch;
    renderMerch();
    renderSectionTabs();
    document.querySelector("#merch").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

sectionTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-section-filter]");
  if (!button) return;
  if (activeView === "screen") {
    screenFilter = button.dataset.sectionFilter;
    if (screenFilter === "iu-official") officialCategoryFilter = "";
    screenVisibleRows = 3;
    renderScreen();
    renderSectionTabs();
    return;
  }
  if (activeView === "merch") {
    merchFilter = button.dataset.sectionFilter;
    merchVisibleRows = 3;
    renderMerch();
    renderSectionTabs();
  }
});

officialShelf?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-official-category]");
  if (!button) return;
  officialCategoryFilter = button.dataset.officialCategory;
  screenVisibleRows = 3;
  renderScreen();
  screenGrid.scrollIntoView({ behavior: "smooth", block: "start" });
});

merchShelf?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-merch-category]");
  if (!button) return;
  merchFilter = button.dataset.merchCategory;
  merchVisibleRows = 3;
  renderMerch();
  merchGrid.scrollIntoView({ behavior: "smooth", block: "start" });
});

function enablePressDragBottomNav(nav) {
  const buttons = [...nav.querySelectorAll("[data-app-view]")];
  const indicator = nav.querySelector(".bottomNav__indicator");
  let holdTimer = 0, dragging = false, pointerId = -1, startX = 0, lastX = 0, targetIndex = 0, suppressClickUntil = 0;
  const clearPreview = () => buttons.forEach((button) => button.classList.remove("drag-preview"));
  const update = (clientX) => {
    const rect = nav.getBoundingClientRect();
    const segment = indicator.offsetWidth;
    const start = indicator.offsetLeft;
    const x = Math.max(0, Math.min(segment * (buttons.length - 1), clientX - rect.left - start - segment / 2));
    const movement = clientX - lastX;
    lastX = clientX;
    targetIndex = Math.round(x / segment);
    nav.style.setProperty("--drag-x", `${x}px`);
    nav.style.setProperty("--drag-scale-x", String(1.06 + Math.min(Math.abs(movement) / 110, 0.14)));
    nav.style.setProperty("--drag-scale-y", String(0.98 - Math.min(Math.abs(movement) / 300, 0.08)));
    clearPreview();
    buttons[targetIndex]?.classList.add("drag-preview");
  };
  const finish = (commit) => {
    clearTimeout(holdTimer);
    nav.classList.remove("is-pressing");
    if (!dragging) return;
    dragging = false;
    nav.classList.remove("is-dragging");
    clearPreview();
    suppressClickUntil = performance.now() + 450;
    if (commit) {
      const button = buttons[targetIndex];
      if (button) {
        setView(button.dataset.appView);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };
  nav.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    nav.classList.add("is-pressing");
    holdTimer = setTimeout(() => {
      dragging = true;
      nav.classList.add("is-dragging");
      nav.setPointerCapture?.(pointerId);
      update(event.clientX);
    }, 280);
  });
  nav.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    if (!dragging && Math.abs(event.clientX - startX) > 10) {
      clearTimeout(holdTimer);
      nav.classList.remove("is-pressing");
      return;
    }
    if (dragging) { event.preventDefault(); update(event.clientX); }
  }, { passive: false });
  nav.addEventListener("pointerup", (event) => { if (event.pointerId === pointerId) finish(true); });
  nav.addEventListener("pointercancel", (event) => { if (event.pointerId === pointerId) finish(false); });
  nav.addEventListener("click", (event) => {
    if (event.detail > 0 && performance.now() < suppressClickUntil) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  }, true);
}
enablePressDragBottomNav(bottomNav);

bottomNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-app-view]");
  if (!button) return;
  setView(button.dataset.appView);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

screenGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-screen-detail]");
  if (!detailButton) return;
  const item = screenItems().find((candidate) => String(candidate.id || candidate.title) === detailButton.dataset.screenDetail);
  if (item) openScreenDetail(item);
});

screenMore?.addEventListener("click", () => {
  screenVisibleRows += 3;
  renderScreen();
});

searchMore?.addEventListener("click", () => {
  searchVisibleRows += 3;
  renderGlobalSearch();
});

merchMore?.addEventListener("click", () => {
  merchVisibleRows += 3;
  renderMerch();
});

toTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

themeControl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme]");
  if (!button) return;
  applyTheme(button.dataset.theme);
});

window.matchMedia?.("(prefers-color-scheme: light)").addEventListener("change", () => {
  if (themeMode === "system") applyTheme("system");
});

screenDetailClose.addEventListener("click", () => screenDetailDialog.close());

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

renderGlobalSearch();

applyTheme(themeMode);

setView("music");

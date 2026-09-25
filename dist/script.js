const records = [
  {
    title: "Love Poem",
    year: "2019",
    album: "Love Poem",
    mood: "comfort",
    creator: true,
    tags: ["安慰", "献给听众", "作词"],
    note: "适合在心很满却说不出口的时候打开。记录重点不是悲伤本身，而是“我会在这里”的陪伴感。",
  },
  {
    title: "Palette",
    year: "2017",
    album: "Palette",
    mood: "self",
    creator: true,
    tags: ["自画像", "二十五岁", "作词作曲"],
    note: "把年龄写成一种清醒的坐标：承认喜欢，也承认改变。适合做生日、阶段总结和自我整理的页签。",
  },
  {
    title: "Through the Night",
    year: "2017",
    album: "Palette",
    mood: "night",
    creator: true,
    tags: ["夜晚", "信件感", "作词"],
    note: "像一封没有寄出的夜间短信，温柔、克制、留白很多。适合放在深夜歌单的第一首。",
  },
  {
    title: "Blueming",
    year: "2019",
    album: "Love Poem",
    mood: "bright",
    creator: true,
    tags: ["明亮", "文字游戏", "作词"],
    note: "把聊天框里的小心思写成轻快的花。页面记录它的蓝色感、轻盈节奏和恋爱时的试探语气。",
  },
  {
    title: "Celebrity",
    year: "2021",
    album: "Lilac",
    mood: "self",
    creator: true,
    tags: ["自我", "鼓励", "作词作曲"],
    note: "写给不合群、被误解、却仍然独一无二的人。很适合放在“需要一点勇气”的清晨。",
  },
  {
    title: "Lilac",
    year: "2021",
    album: "Lilac",
    mood: "bright",
    creator: true,
    tags: ["告别", "春天", "作词"],
    note: "明亮的告别曲，不沉重，却很有仪式感。记录本里把它归为“笑着合上旧章节”。",
  },
  {
    title: "My Sea",
    year: "2021",
    album: "Lilac",
    mood: "comfort",
    creator: true,
    tags: ["成长", "长篇叙事", "作词"],
    note: "适合慢慢听，像从童年走到现在的一次回望。重点记录它的大段情绪推进和辽阔感。",
  },
  {
    title: "Love Wins All",
    year: "2024",
    album: "The Winning",
    mood: "comfort",
    creator: true,
    tags: ["守护", "电影感", "作词"],
    note: "把爱写成共同逃亡和互相照亮。记录本里它是“世界很吵，但仍有人选择牵手”的那一页。",
  },
  {
    title: "Shopper",
    year: "2024",
    album: "The Winning",
    mood: "bright",
    creator: true,
    tags: ["欲望", "轻快", "作词"],
    note: "轻松外壳下有一点俏皮的野心：想要、选择、拿起自己的东西。适合放进通勤提气歌单。",
  },
  {
    title: "Unknown Planet",
    year: "2026",
    album: "Unknown Planet",
    mood: "night",
    creator: true,
    tags: ["双主打", "未知", "作词作曲"],
    note: "档案中最新的双主打节点之一。这里把它记录为从熟悉轨道出发、望向陌生星球的一页。",
  },
];

const storageKey = "iu-lyrics-notebook-polished-v1";
const seedEntries = [
  {
    id: "seed-love-poem",
    songTitle: "Love Poem",
    albumName: "Love Poem",
    mood: "comfort",
    originalText: "记录提示：适合收藏副歌前后的情绪推进，不展示完整歌词。",
    translationText: "像把“我会听见你”写成一首缓慢展开的信。",
    entryNote: "可标注喜欢的现场版本；很适合深夜或低落时回听。",
  },
  {
    id: "seed-through-the-night",
    songTitle: "Through the Night",
    albumName: "Palette",
    mood: "night",
    originalText: "记录提示：夜晚、信件、想念，是这一页的关键词。",
    translationText: "克制的表达比直白更有重量，像一句没有发送出去的晚安。",
    entryNote: "适合作为“睡前页签”。",
  },
  {
    id: "seed-celebrity",
    songTitle: "Celebrity",
    albumName: "Lilac",
    mood: "self",
    originalText: "记录提示：保留鼓励自己的短句，不搬运完整歌词。",
    translationText: "写给那些不必被修正的不同，也写给不够相信自己的时刻。",
    entryNote: "适合早晨出门前听。",
  },
  {
    id: "seed-love-wins-all",
    songTitle: "Love Wins All",
    albumName: "The Winning",
    mood: "comfort",
    originalText: "记录提示：MV、叙事画面和旋律一起记录会更完整。",
    translationText: "不是单纯甜蜜，而是混乱世界里仍然选择守护。",
    entryNote: "可以补充 MV 观看后的理解。",
  },
];

const grid = document.querySelector("#recordGrid");
const searchInput = document.querySelector("#searchInput");
const creatorOnly = document.querySelector("#creatorOnly");
const chips = [...document.querySelectorAll("[data-filter]")];
const shuffleBtn = document.querySelector("#shuffleBtn");
const spotlight = document.querySelector("#spotlight");
const entryForm = document.querySelector("#entryForm");
const libraryCards = document.querySelector("#libraryCards");
const importFile = document.querySelector("#importFile");
const catalog = window.IU_CATALOG;
const releaseShelf = document.querySelector("#releaseShelf");
const trackGrid = document.querySelector("#trackGrid");
const catalogSearch = document.querySelector("#catalogSearch");
const releaseFilter = document.querySelector("#releaseFilter");
const yearFilter = document.querySelector("#yearFilter");
const mediaFilter = document.querySelector("#mediaFilter");
const catalogCount = document.querySelector("#catalogCount");

let activeFilter = "all";
let entries = loadEntries();

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function moodLabel(value) {
  return {
    comfort: "安慰",
    bright: "明亮",
    self: "自我",
    night: "夜晚",
  }[value] || "记录";
}

function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return Array.isArray(saved) && saved.length ? saved : seedEntries;
  } catch {
    return seedEntries;
  }
}

function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function resetEntryForm() {
  entryForm.reset();
  document.querySelector("#entryId").value = "";
}

function renderRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const items = records.filter((record) => {
    const text = `${record.title} ${record.album} ${record.year} ${record.tags.join(" ")}`.toLowerCase();
    const matchesText = !query || text.includes(query);
    const matchesMood = activeFilter === "all" || record.mood === activeFilter;
    const matchesCreator = !creatorOnly.checked || record.creator;
    return matchesText && matchesMood && matchesCreator;
  });

  if (!items.length) {
    grid.innerHTML = `<div class="empty">没有翻到这一页。换一个关键词，或者先取消部分筛选。</div>`;
    return;
  }

  grid.innerHTML = items
    .map(
      (record) => `
        <article class="record">
          <div class="record__meta">
            <span>${record.year}</span>
            <span>${record.album}</span>
          </div>
          <h3>${record.title}</h3>
          <p class="record__note">${record.note}</p>
          <div class="record__tags">
            ${record.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function coverStyle(cover) {
  const colors = cover?.colors || ["#0d1324", "#d6414f", "#f7ead2"];
  return `background: linear-gradient(135deg, ${colors[0]}, ${colors[1]}); color: ${colors[2]};`;
}

function renderReleaseShelf() {
  releaseShelf.innerHTML = catalog.releases
    .map(
      (release) => `
      <button class="releaseCard" type="button" style="${coverStyle(release.cover)}" data-release-name="${escapeHtml(release.title)}">
        <strong>${escapeHtml(release.title)}</strong>
        <span>${release.year} · ${escapeHtml(release.type)} · ${release.track_count} 首</span>
      </button>
    `,
    )
    .join("");
}

function fillCatalogFilters() {
  releaseFilter.innerHTML = `<option value="all">全部发行</option>${catalog.releases
    .map((release) => `<option value="${escapeHtml(release.title)}">${escapeHtml(release.title)}</option>`)
    .join("")}`;
  const years = [...new Set(catalog.tracks.map((track) => track.year))].sort((a, b) => b - a);
  yearFilter.innerHTML = `<option value="all">全部年份</option>${years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("")}`;
}

function renderCatalog() {
  const query = catalogSearch.value.trim().toLowerCase();
  const releaseValue = releaseFilter.value;
  const yearValue = yearFilter.value;
  const mediaValue = mediaFilter.value;
  const filtered = catalog.tracks.filter((track) => {
    const haystack = [
      track.title,
      track.originalTitle,
      track.release,
      track.year,
      track.lyrics,
      track.music,
      track.arrangement,
      track.iuCreationRole,
    ]
      .join(" ")
      .toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (releaseValue !== "all" && track.release !== releaseValue) return false;
    if (yearValue !== "all" && String(track.year) !== yearValue) return false;
    if (mediaValue === "mv" && !track.mv.length) return false;
    if (mediaValue === "creator" && !track.iuCreationRole) return false;
    if (mediaValue === "version" && !track.version) return false;
    return true;
  });

  catalogCount.textContent = `${filtered.length} / ${catalog.tracks.length} tracks`;
  trackGrid.innerHTML =
    filtered
      .map((track) => {
        const mv = track.mv[0];
        return `
        <article class="trackCard">
          <div class="miniCover" style="${coverStyle(track.cover)}">
            <span>${escapeHtml(track.cover?.initials || "IU")}</span>
            <small>${escapeHtml(track.release)}</small>
          </div>
          <div class="trackBody">
            <h3>${escapeHtml(track.title)}</h3>
            <p>${track.year} · ${escapeHtml(track.type)} · ${escapeHtml(track.language)}${track.length ? ` · ${escapeHtml(track.length)}` : ""}</p>
            <p>${track.iuCreationRole ? `IU：${escapeHtml(track.iuCreationRole)}` : `作词：${escapeHtml(track.lyrics || "资料待补")}`}</p>
            <div class="trackBadges">
              ${track.version ? `<span>${escapeHtml(track.version)}</span>` : ""}
              ${track.mv.length ? `<span>${track.mv.length} 条影像</span>` : ""}
            </div>
            <div class="trackLinks">
              <a href="${track.audioLinks.spotify}" target="_blank" rel="noreferrer">Spotify</a>
              <a href="${track.audioLinks.youtubeMusic}" target="_blank" rel="noreferrer">YouTube Music</a>
              <a href="${track.audioLinks.appleMusic}" target="_blank" rel="noreferrer">Apple Music</a>
              ${mv ? `<a href="${mv.youtube}" target="_blank" rel="noreferrer">MV / 影像</a>` : ""}
              <a href="${track.source}" target="_blank" rel="noreferrer">来源</a>
            </div>
          </div>
        </article>
      `;
      })
      .join("") || `<div class="empty">没有匹配的歌曲，换个筛选试试。</div>`;
}

function renderLibrary() {
  libraryCards.innerHTML = entries
    .map(
      (entry) => `
      <article class="libraryCard">
        <div class="libraryCard__top">
          <div>
            <h3>${escapeHtml(entry.songTitle)}</h3>
            <small>${escapeHtml(entry.albumName || "未填写出处")} · ${moodLabel(entry.mood)}</small>
          </div>
          <div class="libraryCard__actions">
            <button class="miniButton" type="button" data-edit="${entry.id}">编辑</button>
            <button class="miniButton" type="button" data-delete="${entry.id}">删除</button>
          </div>
        </div>
        <p>${escapeHtml(entry.translationText || entry.originalText || "还没有摘记。")}</p>
        ${entry.entryNote ? `<p>${escapeHtml(entry.entryNote)}</p>` : ""}
      </article>
    `,
    )
    .join("");
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    chips.forEach((item) => item.classList.toggle("is-active", item === chip));
    renderRecords();
  });
});

releaseShelf.addEventListener("click", (event) => {
  const button = event.target.closest("[data-release-name]");
  if (!button) return;
  releaseFilter.value = button.dataset.releaseName;
  renderCatalog();
  document.querySelector("#catalog").scrollIntoView({ behavior: "smooth", block: "start" });
});

[catalogSearch, releaseFilter, yearFilter, mediaFilter].forEach((control) => {
  control.addEventListener("input", renderCatalog);
  control.addEventListener("change", renderCatalog);
});

searchInput.addEventListener("input", renderRecords);
creatorOnly.addEventListener("change", renderRecords);

shuffleBtn.addEventListener("click", () => {
  const item = records[Math.floor(Math.random() * records.length)];
  spotlight.innerHTML = `
    <span>今日页签</span>
    <strong>${item.title}</strong>
    <small>${item.note}</small>
  `;
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = document.querySelector("#entryId").value || crypto.randomUUID();
  const next = {
    id,
    songTitle: document.querySelector("#songTitle").value.trim(),
    albumName: document.querySelector("#albumName").value.trim(),
    mood: document.querySelector("#entryMood").value,
    originalText: document.querySelector("#originalText").value.trim(),
    translationText: document.querySelector("#translationText").value.trim(),
    entryNote: document.querySelector("#entryNote").value.trim(),
  };
  entries = [next, ...entries.filter((entry) => entry.id !== id)];
  saveEntries();
  resetEntryForm();
  renderLibrary();
});

document.querySelector("#resetForm").addEventListener("click", resetEntryForm);

libraryCards.addEventListener("click", (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  if (editId) {
    const entry = entries.find((item) => item.id === editId);
    if (!entry) return;
    document.querySelector("#entryId").value = entry.id;
    document.querySelector("#songTitle").value = entry.songTitle;
    document.querySelector("#albumName").value = entry.albumName || "";
    document.querySelector("#entryMood").value = entry.mood || "comfort";
    document.querySelector("#originalText").value = entry.originalText || "";
    document.querySelector("#translationText").value = entry.translationText || "";
    document.querySelector("#entryNote").value = entry.entryNote || "";
    entryForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  if (deleteId) {
    entries = entries.filter((item) => item.id !== deleteId);
    saveEntries();
    renderLibrary();
  }
});

document.querySelector("#exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "iu-lyrics-notebook-backup.json";
  link.click();
  URL.revokeObjectURL(url);
});

importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  if (!file) return;
  const imported = JSON.parse(await file.text());
  if (Array.isArray(imported)) {
    entries = imported;
    saveEntries();
    renderLibrary();
  }
  importFile.value = "";
});

renderRecords();
renderReleaseShelf();
fillCatalogFilters();
renderCatalog();
renderLibrary();

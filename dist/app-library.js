const libraryAlbums = window.IU_LOCAL_ALBUMS || [];
const nestedCategories = new Set(['正规专辑', '迷你专辑', '日专', '花书签']);
let libraryCategory = '';
let libraryAlbum = '';
let libraryRows = 4;
let libraryGridSignature = '';
let librarySelectedId = '';
let musicInteracted = false;
const byNewest = (a, b) => (b.publishTime || 0) - (a.publishTime || 0) || (a.trackNo || 0) - (b.trackNo || 0) || String(a.title).localeCompare(String(b.title));
tracks.sort(byNewest);
const subShelf = document.createElement('div');
subShelf.id = 'subShelf';
subShelf.className = 'shelf hidden';
$('#shelf').after(subShelf);
const more = document.createElement('button');
more.id = 'libraryMore';
more.className = 'library-more hidden';
more.textContent = '更多';
$('#grid').after(more);
const libraryCategories = [...new Set(libraryAlbums.map(a => a.category))].map(category => {
  const releases = libraryAlbums.filter(a => a.category === category).sort(byNewest);
  return { category, title: category, cover: releases.find(a => a.cover)?.cover, publishTime: releases[0]?.publishTime || 0 };
}).sort(byNewest);

renderShelf = function () {
  $('#shelf').classList.toggle('hidden', mode !== 'albums');
  $('#shelf').innerHTML = libraryCategories.map(c => `<button type="button" data-category="${esc(c.category)}" class="${c.category === libraryCategory ? 'active' : ''}" aria-pressed="${c.category === libraryCategory}"><img src="${esc(c.cover)}" alt="" loading="lazy"><small>${esc(c.category)}</small></button>`).join('');
  const showChildren = mode === 'albums' && nestedCategories.has(libraryCategory);
  subShelf.classList.toggle('hidden', !showChildren);
  subShelf.innerHTML = showChildren ? libraryAlbums.filter(a => a.category === libraryCategory).sort(byNewest).map(a => `<button type="button" data-library-album="${esc(a.id)}" class="${a.id === libraryAlbum ? 'active' : ''}" aria-pressed="${a.id === libraryAlbum}"><img src="${esc(a.cover)}" alt="" loading="lazy"><small title="${esc(a.title)}">${esc(a.title)}</small></button>`).join('') : '';
};

render = function () {
  // Hidden iframes have no usable grid geometry; keep the current page intact.
  if ($('#grid').getBoundingClientRect().width < 1) return;
  const needsSelection = mode === 'albums' && (!libraryCategory || (nestedCategories.has(libraryCategory) && !libraryAlbum));
  const visible = needsSelection ? [] : tracks.filter(t =>
    (mode !== 'favorites' || favorites.has(t.id)) &&
    (mode !== 'albums' || (t.category === libraryCategory && (!libraryAlbum || t.releaseId === libraryAlbum))) &&
    `${t.title} ${t.originalTitle || ''} ${t.zh || ''} ${t.release}`.toLowerCase().includes(query));
  const columns = getComputedStyle($('#grid')).gridTemplateColumns.trim().split(/\s+/).length;
  const shown = visible.slice(0, columns * libraryRows);
  $('#count').textContent = needsSelection ? '' : `${visible.length} 首`;
  $('#empty').classList.toggle('hidden', needsSelection || visible.length > 0);
  const gridSignature = shown.map(t => t.id).join('|');
  if (gridSignature !== libraryGridSignature) {
    libraryGridSignature = gridSignature;
    $('#grid').innerHTML = shown.map(t => {
      const name = t.displayTitle || t.originalTitle || t.title;
      const note = t.zhStatus === 'reference' ? '（参考译名，尚未确认通行中文名称）' : '';
      return `<button class="card" data-id="${esc(t.id)}" aria-label="${esc(name)}，${esc(t.zh)}${esc(note)}"><div class="art"><img src="${esc(coverFor(t))}" alt="${esc(t.release)}" loading="lazy" decoding="async"></div><strong title="${esc(name)}">${esc(name)}</strong><small title="${esc(t.zh)}${esc(note)}">${esc(t.zh)}</small></button>`;
    }).join('');
  }
  $('#grid').querySelectorAll('.card').forEach(card => card.classList.toggle('selected', card.dataset.id === tracks[selected]?.id));
  more.classList.toggle('hidden', shown.length >= visible.length);
  $('.fav').textContent = favorites.has(tracks[selected]?.id) ? '♥' : '♡';
  $('#side').classList.toggle('library-blank', mode === 'albums' && !$('#side').classList.contains('open'));
};

choose = async function (index, userAction = true) {
  selected = (index + tracks.length) % tracks.length;
  const t = tracks[selected];
  if (userAction) musicInteracted = true;
  $('.mini').classList.toggle('hidden', !musicInteracted);
  if (librarySelectedId === t.id) { render(); return; }
  librarySelectedId = t.id;
  for (const cover of [$('#cover'), $('#minicover')]) if (cover.getAttribute('src') !== coverFor(t)) cover.src = coverFor(t);
  $('#title').textContent = t.displayTitle || t.originalTitle || t.title;
  $('#subtitle').textContent = t.zh;
  $('#subtitle').title = t.zhStatus === 'reference' ? '参考译名，尚未确认通行中文名称' : t.zh;
  $('#minititle').textContent = t.displayTitle || t.title;
  $('#minisub').textContent = audioMap[t.id] ? '已绑定本地音频' : onlineAudio[t.id]?.url ? '可在线播放' : '音源后续补充';
  if (currentAudio) { currentAudio.pause(); currentAudio = null; $('.play').textContent = '▶'; }
  const token = ++request;
  const box = $('#lyrics');
  const local = window.IU_LOCAL_LYRICS?.[t.id];
  if (local?.lines?.length) {
    box.innerHTML = local.lines.map(l => `<div class="verse">${esc(l.original)}${l.translation ? `<small>${esc(l.translation)}</small>` : ''}</div>`).join('');
  } else {
    box.innerHTML = '<p class="empty">本地文件暂未提供这首歌的歌词</p>';
  }
  if (token === request) render();
};

$('#shelf').onclick = event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  libraryCategory = button.dataset.category;
  libraryAlbum = '';
  libraryRows = 4;
  $('#side').classList.remove('open');
  renderShelf();
  render();
};
subShelf.onclick = event => {
  const button = event.target.closest('[data-library-album]');
  if (!button) return;
  libraryAlbum = button.dataset.libraryAlbum;
  libraryRows = 4;
  renderShelf();
  render();
};
$('#grid').onclick = event => {
  const card = event.target.closest('[data-id]');
  if (!card) return;
  const now = Date.now();
  const doubleTap = lastCardTap.id === card.dataset.id && now - lastCardTap.time < 650;
  lastCardTap = { id: card.dataset.id, time: now };
  choose(tracks.findIndex(t => t.id === card.dataset.id));
  if (doubleTap) { $('#side').classList.remove('library-blank'); openLyrics(); }
  else if (matchMedia('(max-width:740px)').matches && (audioMap[card.dataset.id] || onlineAudio[card.dataset.id]?.url)) playCurrent();
};
document.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => {
  mode = button.dataset.tab;
  libraryCategory = '';
  libraryAlbum = '';
  libraryRows = 4;
  $('#side').classList.remove('open');
  document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b === button));
  renderShelf();
  render();
});
$('#searchInput').oninput = event => { query = event.target.value.toLowerCase(); libraryRows = 4; render(); };
more.onclick = () => { libraryRows += 4; render(); };
let resizeFrame;
addEventListener('resize', () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(render); });
renderShelf();
choose(0, false);

// Both entry points use the same Music UI; only navigation is delegated when embedded.
const embeddedMusic = window.parent !== window;
for (const shelf of [$('#shelf'), subShelf]) {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.step = '1';
  slider.value = '0';
  slider.className = 'shelf-scrollbar hidden';
  slider.setAttribute('aria-label', shelf === subShelf ? '滚动子专辑栏' : '滚动专辑分类栏');
  shelf.after(slider);
  const sync = () => {
    const max = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
    slider.max = String(max);
    slider.value = String(shelf.scrollLeft);
    slider.classList.toggle('hidden', shelf.classList.contains('hidden') || max < 1);
  };
  slider.oninput = () => { shelf.scrollLeft = Number(slider.value); };
  shelf.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(shelf);
  new MutationObserver(() => requestAnimationFrame(sync)).observe(shelf, { childList: true, attributes: true });
  sync();
}
const setMusicTheme = light => {
  document.body.classList.toggle('light', light);
  $('.logo').src = `assets/uaena-symbol-${light ? 'light' : 'dark'}.png`;
};
setMusicTheme(localStorage.getItem('uaena-music-light') === 'true');
$('.theme').onclick = () => {
  const light = !document.body.classList.contains('light');
  setMusicTheme(light);
  localStorage.setItem('uaena-music-light', String(light));
  if (embeddedMusic) parent.postMessage({ type: 'uaena-theme-change', light }, location.origin);
};
if (embeddedMusic) {
  const views = { Tv: 'screen', Present: 'merch', Search: 'search', Profile: 'profile' };
  document.querySelectorAll('[data-nav]').forEach(button => button.onclick = () => {
    const view = views[button.dataset.nav];
    if (view) parent.postMessage({ type: 'uaena-navigate', view }, location.origin);
  });
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent) return;
    if (event.data?.type === 'uaena-view-active') {
      requestAnimationFrame(() => requestAnimationFrame(render));
    }
    if (event.data?.type === 'uaena-open-track') {
      const index = tracks.findIndex(track => track.id === event.data.id);
      if (index >= 0) { choose(index); $('#side').classList.remove('library-blank'); openLyrics(); }
    }
    if (event.data?.type === 'uaena-open-album') {
      const entry = libraryAlbums.find(a => a.id === event.data.id || a.title === event.data.title);
      if (entry) {
        mode = 'albums'; libraryCategory = entry.category; libraryAlbum = entry.id; libraryRows = 4; query = '';
        $('#searchInput').value = '';
        document.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === mode));
        renderShelf(); render();
      }
    }
    if (event.origin === location.origin && event.source === parent && event.data?.type === 'uaena-theme') {
      setMusicTheme(event.data.light);
      localStorage.setItem('uaena-music-light', String(event.data.light));
    }
  });
} else {
  const views = { Tv: 'screen', Present: 'merch', Search: 'search', Profile: 'profile' };
  document.querySelectorAll('[data-nav]').forEach(button => {
    if (views[button.dataset.nav]) button.onclick = () => {
      localStorage.setItem('iu-theme-mode-v1', document.body.classList.contains('light') ? 'light' : 'dark');
      location.href = `./?view=${views[button.dataset.nav]}`;
    };
  });
}

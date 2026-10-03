const libraryAlbums = window.IU_LOCAL_ALBUMS || [];
const nestedCategories = new Set(['正规专辑', '迷你专辑', '日专', '花书签']);
let libraryCategory = '';
let libraryAlbum = '';
let libraryRows = 4;
let libraryGridSignature = '';
let librarySelectedId = '';
let libraryHighlightedId = '';
let cardActionId = '';
let lastCardTap = { id: '', time: 0 };
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
  visibleTrackIds = visible.map(track => track.id);
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
      return `<div class="card" data-id="${esc(t.id)}" role="button" tabindex="0" aria-label="${esc(name)}，${esc(t.zh)}${esc(note)}"><div class="art"><img src="${esc(coverFor(t))}" alt="${esc(t.release)}" loading="lazy" decoding="async"><div class="card-actions" aria-label="歌曲操作"><button type="button" data-card-action="play" title="播放" aria-label="播放 ${esc(name)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg></button><button type="button" data-card-action="pause" title="暂停" aria-label="暂停 ${esc(name)}" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg></button><button type="button" data-card-action="add" title="加入播放列表" aria-label="将 ${esc(name)} 加入播放列表"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v2H5zm0 4h14v2H5zm0 4h14v2H5z"/></svg></button></div></div><strong title="${esc(name)}">${esc(name)}</strong><small title="${esc(t.zh)}${esc(note)}">${esc(t.zh)}</small></div>`;
    }).join('');
  }
  $('#grid').querySelectorAll('.card').forEach(card => card.classList.toggle('selected', card.dataset.id === libraryHighlightedId));
  syncCardActions();
  more.classList.toggle('hidden', shown.length >= visible.length);
  const favorite = favorites.has(tracks[selected]?.id);
  $('.fav').textContent = favorite ? '♥' : '♡';
  $('.mini-fav').textContent = favorite ? '♥' : '♡';
  $('.mini-fav').classList.toggle('is-favorite', favorite);
  $('.mini-fav').setAttribute('aria-pressed', String(favorite));
  $('.mini-fav').setAttribute('aria-label', favorite ? '取消收藏当前歌曲' : '收藏当前歌曲');
  $('#side').classList.toggle('library-blank', mode === 'albums' && !$('#side').classList.contains('open'));
};

choose = async function (index, userAction = true) {
  selected = (index + tracks.length) % tracks.length;
  const t = tracks[selected];
  if (userAction) musicInteracted = true;
  $('.mini').classList.remove('hidden');
  if (librarySelectedId === t.id) { render(); renderQueue(); return; }
  librarySelectedId = t.id;
  for (const cover of [$('#cover'), $('#minicover')]) if (cover.getAttribute('src') !== coverFor(t)) cover.src = coverFor(t);
  $('#title').textContent = t.displayTitle || t.originalTitle || t.title;
  $('#subtitle').textContent = t.zh;
  $('#subtitle').title = t.zhStatus === 'reference' ? '参考译名，尚未确认通行中文名称' : t.zh;
  $('#minititle').textContent = titleFor(t);
  $('#minisub').textContent = t.zh || t.release || 'IU';
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  setPlayingUi(false);
  $('.mini-progress').value = '0';
  $('.mini-progress').style.setProperty('--player-progress', '0%');
  clearActiveLyrics();
  setSystemMetadata(t);
  const token = ++request;
  const box = $('#lyrics');
  const local = window.IU_LOCAL_LYRICS?.[t.id];
  if (local?.lines?.length) {
    box.innerHTML = local.lines.map(l => `<div class="verse"${Number.isFinite(Number(l.time)) ? ` data-time="${Number(l.time)}"` : ''}>${esc(l.original)}${l.translation ? `<small>${esc(l.translation)}</small>` : ''}</div>`).join('');
  } else {
    box.innerHTML = '<p class="empty">本地文件暂未提供这首歌的歌词</p>';
  }
  if (token === request) { render(); renderQueue(); }
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
syncCardActions = function () {
  const playingId = currentAudio && !currentAudio.paused ? tracks[selected]?.id : '';
  $('#grid').querySelectorAll('.card').forEach(card => {
    card.classList.toggle('actions-open', card.dataset.id === cardActionId);
    const pause = card.querySelector('[data-card-action="pause"]');
    if (pause) pause.hidden = card.dataset.id !== playingId;
  });
};

$('#grid').onclick = async event => {
  const action = event.target.closest('[data-card-action]');
  if (action) {
    const card = action.closest('[data-id]');
    const id = card?.dataset.id;
    if (!id) return;
    event.stopPropagation();
    if (action.dataset.cardAction === 'play') {
      const sameTrack = tracks[selected]?.id === id && currentAudio;
      if (sameTrack) {
        if (currentAudio.paused) await currentAudio.play().catch(error => showPlaybackError(error));
      } else {
        await playTrackFromCurrentView(id);
      }
    }
    if (action.dataset.cardAction === 'pause' && tracks[selected]?.id === id) currentAudio?.pause();
    if (action.dataset.cardAction === 'add') addTrackToQueue(id);
    cardActionId = '';
    syncCardActions();
    return;
  }
  const card = event.target.closest('[data-id]');
  if (!card) return;
  libraryHighlightedId = card.dataset.id;
  $('#grid').querySelectorAll('.card').forEach(item => item.classList.toggle('selected', item === card));
  const now = Date.now();
  const doubleTap = event.detail >= 2 || (lastCardTap.id === card.dataset.id && now - lastCardTap.time < 650);
  lastCardTap = doubleTap ? { id: '', time: 0 } : { id: card.dataset.id, time: now };
  cardActionId = doubleTap ? card.dataset.id : '';
  syncCardActions();
};
$('#grid').onkeydown = event => {
  if (event.target.closest('[data-card-action]')) return;
  const card = event.target.closest('[data-id]');
  if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
  event.preventDefault();
  card.click();
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
      if (index >= 0) choose(index);
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

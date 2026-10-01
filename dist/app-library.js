const libraryAlbums = window.IU_LOCAL_ALBUMS || [];
const nestedCategories = new Set(['正规专辑', '迷你专辑', '日专', '花书签']);
let libraryCategory = '';
let libraryAlbum = '';
let libraryRows = 4;
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
  const needsSelection = mode === 'albums' && (!libraryCategory || (nestedCategories.has(libraryCategory) && !libraryAlbum));
  const visible = needsSelection ? [] : tracks.filter(t =>
    (mode !== 'favorites' || favorites.has(t.id)) &&
    (mode !== 'albums' || (t.category === libraryCategory && (!libraryAlbum || t.releaseId === libraryAlbum))) &&
    `${t.title} ${t.originalTitle || ''} ${t.zh || ''} ${t.release}`.toLowerCase().includes(query));
  const columns = getComputedStyle($('#grid')).gridTemplateColumns.split(' ').length;
  const shown = visible.slice(0, columns * libraryRows);
  $('#count').textContent = needsSelection ? '' : `${visible.length} 首`;
  $('#empty').classList.toggle('hidden', needsSelection || visible.length > 0);
  $('#grid').innerHTML = shown.map(t => `<button class="card ${tracks[selected]?.id === t.id ? 'selected' : ''} ${audioMap[t.id] ? 'has-audio' : ''}" data-id="${esc(t.id)}"><div class="art"><img src="${esc(coverFor(t))}" alt="${esc(t.release)}" loading="lazy"><span class="audio-dot" title="${audioMap[t.id] ? '已绑定音频' : '未绑定音频'}"></span></div><strong title="${esc(t.originalTitle || t.title)}">${esc(t.originalTitle || t.title)}</strong><small>${esc(t.zh || t.release)}</small></button>`).join('');
  more.classList.toggle('hidden', shown.length >= visible.length);
  $('.fav').textContent = favorites.has(tracks[selected]?.id) ? '♥' : '♡';
  $('#side').classList.toggle('library-blank', mode === 'albums' && !$('#side').classList.contains('open'));
  updateProfile();
};

choose = async function (index) {
  selected = (index + tracks.length) % tracks.length;
  const t = tracks[selected];
  $('#cover').src = $('#minicover').src = coverFor(t);
  $('#title').textContent = t.originalTitle || t.title;
  $('#subtitle').textContent = t.zh || t.release;
  $('#minititle').textContent = t.title;
  $('#minisub').textContent = audioMap[t.id] ? '已绑定本地音频' : '音源后续补充';
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
  else if (matchMedia('(max-width:740px)').matches && audioMap[card.dataset.id]) playCurrent();
};
document.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => {
  mode = button.dataset.tab;
  libraryCategory = '';
  libraryAlbum = '';
  album = '';
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
choose(0);

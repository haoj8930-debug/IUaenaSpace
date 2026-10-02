const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const storeKey = 'uaena-app-preview-v2';
const tracks = (window.IU_LOCAL_TRACKS || []).map(t => ({ ...t, originalTitle: t.originalTitle || t.title, zh: t.zh || '', release: t.release || t.category || '本地专辑' }));
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storeKey) || '{}') || {}; } catch {}
const favorites = new Set(saved.favorites || []);
let audioMap = saved.audioMap || {};
const audioUrls = {};
let selected = 0, mode = 'songs', query = '', request = 0, deferredInstall = null, currentAudio = null;
let lastCardTap = { id: '', time: 0 };
let render, choose, renderShelf;
const $ = selector => document.querySelector(selector);
const coverFor = t => t.cover || 'assets/covers/palette.jpg';
const save = () => localStorage.setItem(storeKey, JSON.stringify({ favorites: [...favorites], audioMap }));
function toast(text) {
  const el = $('.toast');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}
const db = {
  open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('uaena-local-audio', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('audio');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async get(id) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const req = database.transaction('audio').objectStore('audio').get(id);
      req.onsuccess = () => { database.close(); resolve(req.result); };
      req.onerror = () => { database.close(); reject(req.error); };
    });
  }
};
async function srcFor(t) {
  if (audioUrls[t.id]) return audioUrls[t.id];
  if (!audioMap[t.id]) return '';
  const file = await db.get(t.id).catch(() => null);
  if (!file) return '';
  return audioUrls[t.id] = URL.createObjectURL(file);
}
async function playCurrent() {
  const t = tracks[selected];
  const src = await srcFor(t);
  if (tracks[selected]?.id !== t.id) return;
  if (!src) { toast('音源后续补充'); return; }
  if (currentAudio && currentAudio.src === src && !currentAudio.paused) {
    currentAudio.pause(); $('.play').textContent = '▶'; return;
  }
  if (!currentAudio || currentAudio.src !== src) {
    currentAudio?.pause();
    currentAudio = new Audio(src);
    currentAudio.onended = () => { $('.play').textContent = '▶'; };
    currentAudio.onerror = () => toast('这个音频浏览器暂时无法播放');
  }
  await currentAudio.play().then(() => {
    $('.play').textContent = 'Ⅱ'; $('#minisub').textContent = '正在播放本地音频';
  }).catch(() => toast('浏览器阻止播放，请再点一次播放'));
}
const openLyrics = () => $('#side').classList.add('open');
$('.fav').onclick = () => {
  const id = tracks[selected].id;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  save(); render();
};
$('.prev').onclick = () => choose(selected - 1);
$('.next').onclick = () => choose(selected + 1);
$('.play').onclick = playCurrent;
$('.meta').onclick = openLyrics;
$('.meta').onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLyrics(); } };
$('#side .close').onclick = () => $('#side').classList.remove('open');
document.addEventListener('keydown', event => { if (event.key === 'Escape') $('#side').classList.remove('open'); });
$('.nav').innerHTML = '<span class="nav-indicator"></span>' + [['headphones', 'Music'], ['tv', 'Tv'], ['gift', 'Present'], ['search', 'Search'], ['user-round', 'Profile']].map(([icon, name], i) => `<button class="${i === 0 ? 'active' : ''}" data-nav="${name}" aria-label="${name}" title="${name}"><img src="assets/icons/${icon}.svg" alt="">${name}</button>`).join('');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); deferredInstall = event; $('.install').classList.remove('hidden');
});
$('.install').onclick = async () => {
  if (!deferredInstall) { toast('浏览器菜单里也可以安装到桌面'); return; }
  deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $('.install').classList.add('hidden');
};
if ('serviceWorker' in navigator) navigator.serviceWorker.register('app-sw.js').catch(() => {});

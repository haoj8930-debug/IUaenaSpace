const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const storeKey = 'uaena-app-preview-v2';
const tracks = (window.IU_LOCAL_TRACKS || []).map(t => ({ ...t, originalTitle: t.originalTitle || t.title, zh: t.zh || '', release: t.release || t.category || '本地专辑' }));
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storeKey) || '{}') || {}; } catch {}
const favorites = new Set(saved.favorites || []);
let audioMap = saved.audioMap || {};
const audioUrls = {};
const onlineAudio = window.IU_AUDIO_SOURCES || {};
const playbackModes = ['list', 'one', 'shuffle'];
let playbackMode = playbackModes.includes(saved.playbackMode) ? saved.playbackMode : 'list';
let selected = 0, mode = 'songs', query = '', request = 0, deferredInstall = null, currentAudio = null;
let activeLyricTime = null;
let lastCardTap = { id: '', time: 0 };
let render, choose, renderShelf;
const $ = selector => document.querySelector(selector);
const coverFor = t => t.cover || 'assets/covers/palette.jpg';
const titleFor = t => t.displayTitle || t.originalTitle || t.title;
const save = () => localStorage.setItem(storeKey, JSON.stringify({ favorites: [...favorites], audioMap, playbackMode }));
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
  if (audioMap[t.id]) {
    const file = await db.get(t.id).catch(() => null);
    if (file) return audioUrls[t.id] = URL.createObjectURL(file);
  }
  return onlineAudio[t.id]?.url || '';
}

function setPlayingUi(playing) {
  const button = $('.play');
  button.classList.toggle('is-playing', playing);
  button.title = playing ? '暂停' : '播放';
  button.setAttribute('aria-label', playing ? '暂停' : '播放');
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}

function setPlaybackModeUi() {
  const labels = { list: '列表循环', one: '单曲循环', shuffle: '随机播放' };
  const icons = { list: '↻', one: '↻¹', shuffle: '⇄' };
  const button = $('.playback-mode');
  button.textContent = icons[playbackMode];
  button.title = labels[playbackMode];
  button.setAttribute('aria-label', `播放模式：${labels[playbackMode]}`);
  button.dataset.mode = playbackMode;
}

function setSystemMetadata(track, lyric = null) {
  if (!('mediaSession' in navigator) || !window.MediaMetadata || !track) return;
  const songTitle = titleFor(track);
  const artwork = new URL(coverFor(track), location.href).href;
  const lyricTitle = lyric?.original?.trim();
  navigator.mediaSession.metadata = new MediaMetadata({
    title: lyricTitle || songTitle,
    artist: lyricTitle ? (lyric.translation?.trim() || `${songTitle} · IU`) : (track.zh || 'IU'),
    album: lyricTitle ? `${songTitle} · UAENA小窝` : 'UAENA小窝',
    artwork: [{ src: artwork }]
  });
}

function timedLyricsFor(track = tracks[selected]) {
  return (window.IU_LOCAL_LYRICS?.[track?.id]?.lines || []).filter(line => Number.isFinite(Number(line.time)));
}

function clearActiveLyrics() {
  activeLyricTime = null;
  document.querySelectorAll('.verse.is-active').forEach(verse => verse.classList.remove('is-active'));
}

function syncLyricsAt(seconds, force = false) {
  const track = tracks[selected];
  const lines = timedLyricsFor(track);
  const elapsed = seconds * 1000;
  let nextTime = null;
  for (const line of lines) {
    const time = Number(line.time);
    if (time <= elapsed) nextTime = time;
    else break;
  }
  if (!force && nextTime === activeLyricTime) return;
  activeLyricTime = nextTime;
  const verses = [...document.querySelectorAll('.verse[data-time]')];
  let activeVerse = null;
  for (const verse of verses) {
    const active = nextTime !== null && Number(verse.dataset.time) === nextTime;
    verse.classList.toggle('is-active', active);
    if (active && !activeVerse) activeVerse = verse;
  }
  if (activeVerse && $('#side').classList.contains('open')) {
    activeVerse.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  if (currentAudio && !currentAudio.paused && nextTime !== null) {
    const matching = lines.filter(line => Number(line.time) === nextTime);
    setSystemMetadata(track, matching.find(line => line.translation?.trim()) || matching[0]);
  } else if (nextTime === null) {
    setSystemMetadata(track);
  }
}

function syncProgress() {
  const progress = $('.mini-progress');
  const duration = currentAudio?.duration;
  const position = currentAudio?.currentTime || 0;
  const value = Number.isFinite(duration) && duration > 0 ? Math.round(position / duration * 1000) : 0;
  progress.value = String(value);
  progress.style.setProperty('--player-progress', `${value / 10}%`);
  if ('mediaSession' in navigator && Number.isFinite(duration) && duration > 0) {
    try {
      navigator.mediaSession.setPositionState({ duration, playbackRate: currentAudio.playbackRate || 1, position: Math.min(position, duration) });
    } catch {}
  }
}

async function selectTrack(index, autoplay = false) {
  await choose(index);
  if (autoplay) await playCurrent();
}

async function stepTrack(delta) {
  const autoplay = Boolean(currentAudio && !currentAudio.paused);
  await selectTrack(selected + delta, autoplay);
}

async function handleEnded() {
  if (playbackMode === 'one' && currentAudio) {
    currentAudio.currentTime = 0;
    await currentAudio.play().catch(() => {});
    return;
  }
  const index = playbackMode === 'shuffle' && tracks.length > 1
    ? (selected + 1 + Math.floor(Math.random() * (tracks.length - 1))) % tracks.length
    : selected + 1;
  await selectTrack(index, true);
}

async function playCurrent() {
  const t = tracks[selected];
  const src = await srcFor(t);
  if (tracks[selected]?.id !== t.id) return;
  if (!src) { toast('音源后续补充'); return; }
  const absoluteSrc = new URL(src, location.href).href;
  if (currentAudio && currentAudio.src === absoluteSrc && !currentAudio.paused) {
    currentAudio.pause(); return;
  }
  if (!currentAudio || currentAudio.src !== absoluteSrc) {
    currentAudio?.pause();
    currentAudio = new Audio(src);
    currentAudio.preload = 'metadata';
    currentAudio.onplay = () => { setPlayingUi(true); syncLyricsAt(currentAudio.currentTime, true); };
    currentAudio.onpause = () => setPlayingUi(false);
    currentAudio.onended = handleEnded;
    currentAudio.ontimeupdate = () => { syncProgress(); syncLyricsAt(currentAudio.currentTime); };
    currentAudio.onloadedmetadata = syncProgress;
    currentAudio.onerror = () => toast('这个音频浏览器暂时无法播放');
  }
  await currentAudio.play().then(() => {
    setPlayingUi(true);
  }).catch(() => toast('浏览器阻止播放，请再点一次播放'));
}
const openLyrics = () => $('#side').classList.add('open');
$('.fav').onclick = () => {
  const id = tracks[selected].id;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  save(); render();
};
$('.prev').onclick = () => stepTrack(-1);
$('.next').onclick = () => stepTrack(1);
$('.play').onclick = playCurrent;
$('.playback-mode').onclick = () => {
  playbackMode = playbackModes[(playbackModes.indexOf(playbackMode) + 1) % playbackModes.length];
  setPlaybackModeUi();
  save();
};
$('.mini-progress').oninput = event => {
  if (!currentAudio || !Number.isFinite(currentAudio.duration) || currentAudio.duration <= 0) return;
  currentAudio.currentTime = Number(event.target.value) / 1000 * currentAudio.duration;
  syncProgress();
  syncLyricsAt(currentAudio.currentTime, true);
};
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
setPlaybackModeUi();
if ('mediaSession' in navigator) {
  const handlers = {
    play: () => playCurrent(),
    pause: () => currentAudio?.pause(),
    previoustrack: () => stepTrack(-1),
    nexttrack: () => stepTrack(1),
    seekto: details => {
      if (!currentAudio || !Number.isFinite(details.seekTime)) return;
      currentAudio.currentTime = Math.max(0, Math.min(details.seekTime, currentAudio.duration || details.seekTime));
      syncProgress();
      syncLyricsAt(currentAudio.currentTime, true);
    }
  };
  for (const [action, handler] of Object.entries(handlers)) {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
  }
}

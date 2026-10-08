/* Persistent UI and personal library. Audio stays in the live Music document. */
(() => {
  if (parent !== window) document.body.classList.add('embedded-music');
  const key = 'uaena-personal-library-v1';
  let state = {};
  try { state = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch {}
  const validIds = ids => [...new Set((Array.isArray(ids) ? ids : []).filter(id => tracks.some(t => t.id === id)))];
  let playlists = (Array.isArray(state.playlists) ? state.playlists : []).filter(p => p && typeof p.id === 'string' && typeof p.name === 'string').map(p => ({ id: p.id, name: p.name.slice(0, 60), ids: validIds(p.ids) }));
  let recent = validIds(state.recent).slice(0, 100);
  let activePlaylist = '';
  const settings = { size: 20, translation: true, offset: 0, ...state.settings };
  settings.size = Math.max(16, Math.min(30, Number(settings.size) || 20));
  settings.offset = Math.max(-5000, Math.min(5000, Number(settings.offset) || 0));
  let collapsed = !!state.collapsed, sleepUntil = 0, sleepAfterSong = false;
  let root = document, host = $('.dock');
  const mini = $('.mini');
  const bubble = document.createElement('div');
  bubble.className = 'player-bubble';
  bubble.innerHTML = '<button type="button" class="bubble-expand" aria-label="展开播放器"><img alt="当前歌曲封面"></button><button type="button" class="bubble-status" aria-label="播放">▶</button>';
  document.body.append(bubble);
  const miniCover = document.createElement('button');
  miniCover.type = 'button'; miniCover.className = 'mini-cover-toggle'; miniCover.setAttribute('aria-label', '点击封面收起播放器');
  $('#minicover').before(miniCover); miniCover.append($('#minicover'));
  const dialog = document.createElement('dialog');
  dialog.className = 'player-dialog'; dialog.setAttribute('aria-labelledby', 'playerFeatureDialogTitle'); document.body.append(dialog);
  const tutorialButton = document.createElement('button');
  tutorialButton.type = 'button'; tutorialButton.className = 'tutorial-toggle'; tutorialButton.title = '使用教程';
  tutorialButton.setAttribute('aria-label', '打开使用教程'); tutorialButton.setAttribute('aria-haspopup', 'dialog');
  tutorialButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 8.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 1.8-2.4 3.5"/><path d="M12 16.5h.01"/></svg>';
  $('.theme').before(tutorialButton);
  const fanchantLink = document.createElement('a');
  fanchantLink.className = 'fanchant-link'; fanchantLink.href = 'https://fanchants.iutsc.com/';
  fanchantLink.target = '_blank'; fanchantLink.rel = 'noopener noreferrer';
  fanchantLink.title = '应援教程'; fanchantLink.setAttribute('aria-label', '应援教程（在新标签页打开）');
  fanchantLink.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 14 4 3-4 5-4-3z"/><path d="m9 14-2-4 2-5 5-2 5 4 1 5-4 4-3 1"/><path d="m10 7 2-1 3 2 1 3-2 2"/><path d="m3 3 1 1M20 2l-1 2M22 16l-2-1"/></svg>';
  const brandTitle = document.createElement('div'); brandTitle.className = 'brand-title';
  const brandName = $('.brand strong'); brandName.before(brandTitle); brandTitle.append(brandName, fanchantLink);
  const tutorialDialog = document.createElement('dialog');
  tutorialDialog.className = 'music-tutorial'; tutorialDialog.setAttribute('aria-labelledby', 'musicTutorialTitle');
  tutorialDialog.innerHTML = `<header><div><small>UAENA · MUSIC GUIDE</small><h2 id="musicTutorialTitle">使用教程</h2></div><button type="button" class="tutorial-close" aria-label="关闭教程" autofocus>×</button></header><div class="tutorial-content" tabindex="0" aria-label="教程内容">
    <p class="tutorial-intro">从听一首歌开始，把喜欢的 IU 音乐整理成自己的歌单。</p>
    <section><h3>01 · 播放与收藏</h3><p>单击歌曲卡片选中它，双击卡片显示操作按钮。点击三角形播放；正在播放的歌曲会显示暂停按钮。点击播放器或歌词页的爱心可以收藏、取消收藏。</p></section>
    <section><h3>02 · 创建自己的歌单</h3><p>在“歌曲 / 专辑 / 收藏”旁点击“歌单”，选择“＋ 新建歌单”并填写名称。</p><p>双击歌曲卡片 → 点击列表图标 → 加入歌单，选择已有歌单或新建歌单。进入歌单后，可以改名、调整歌曲顺序、移除歌曲、播放全部或随机播放。删除歌单只删除记录，不影响歌曲与收藏。</p></section>
    <section><h3>03 · 播放列表与播放模式</h3><p>点击长条播放器的列表图标打开播放列表。顶部可以选择随机播放、单曲循环、列表循环；用 ↑ / ↓ 调整队列顺序。</p><p>歌曲操作菜单中的“下一首播放”会把歌曲安排到当前歌曲之后，“加入播放列表”会加入队列。注意：从歌曲、专辑或歌单开始播放，会用该视图的歌曲建立新的播放队列。</p></section>
    <section><h3>04 · 收起播放器，不挡视野</h3><p>点击长条播放器的封面，收起成小图标；拖动小封面可吸附到屏幕两侧，点击封面恢复长条。小图标右下角的播放 / 暂停按钮独立控制音乐，不会展开播放器。收起、切换站内页面和打开小卡都不会主动暂停音乐。</p></section>
    <section><h3>05 · 歌词与滑动切歌</h3><p>点击长条播放器的歌词区域展开歌词，底部播放器会暂时隐藏；点击右上角 × 关闭歌词后，恢复之前的播放器样式。长条中的歌词往左滑是下一首，往右滑是上一首；双击带时间戳的歌词可跳到这一句播放。</p><p>歌词页封面左边是上一首，右边是下一首，点击封面可暂停或继续播放，封面上不显示状态按钮。封面下方的进度条显示已播放时间和总时长，点击或拖动可以跳转播放位置。</p><p>点击顶部的向上箭头，或把封面向上拖动，进入“纯歌词”：隐藏封面、进度条和歌名，让歌词占满剩余空间，不影响音乐播放。点击同一位置的向下箭头即可恢复封面和控制。</p><p>右上角 × 旁边的“设置”可调整字号、开关翻译、微调同步时间。默认不提前或延后；同步微调的正值表示提前显示，负值表示延后显示。深色模式的当前歌词以浅薰衣草紫高亮显示。</p></section>
    <section><h3>06 · 定时停止与最近播放</h3><p>打开播放列表 → 设置，可以选择 15、30、60 分钟后停止，或在当前歌曲结束时停止。选择“关闭定时”即可取消。</p><p>“最近”页保留最近播放过的歌曲，方便再次播放。</p></section>
    <section><h3>07 · 影视与官方视频</h3><p>底部电视图标进入影视页。IU Official 查看官方视频及 Shorts；LIVE 收录有真实视频封面的官方演唱会单曲，点击封面或 YouTube 按钮打开原视频。核实过的其他平台转载会单独标明。原演唱会档案已并入“电影 / 演唱会”。封面保持原比例，介绍位于图片下面且无白色底板；“详细信息”可查看作品介绍。</p></section>
    <section class="tutorial-notice"><h3>使用前请留意</h3><p>歌单、收藏、最近播放与歌词设置保存在当前浏览器，暂不跨设备同步；清除网站数据会丢失这些记录。</p><p>手机系统可能冻结后台网页，或浏览器可能限制播放。网站不会因切页主动暂停，但无法保证系统冻结或关闭后继续播放；定时停止也可能延后到网页恢复执行。系统播放栏按钮的显示取决于手机和浏览器支持。</p></section>
  </div>`;
  document.body.append(tutorialDialog);
  tutorialButton.onclick = () => { if (!tutorialDialog.open) { tutorialDialog.showModal(); tutorialDialog.querySelector('.tutorial-content').scrollTop = 0; } };
  tutorialDialog.querySelector('.tutorial-close').onclick = () => tutorialDialog.close();
  tutorialDialog.addEventListener('close', () => tutorialButton.focus({ preventScroll: true }));
  tutorialDialog.addEventListener('click', event => {
    if (event.target !== tutorialDialog) return;
    const rect = tutorialDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) tutorialDialog.close();
  });
  const personalPanel = document.createElement('section');
  personalPanel.className = 'personal-library hidden'; $('#grid').before(personalPanel);
  const tabs = $('.tabs');
  for (const [tab, label] of [['playlists', '歌单'], ['recent', '最近']]) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.tab = tab; button.textContent = label;
    tabs.append(button);
    button.onclick = () => {
      mode = tab; query = ''; $('#searchInput').value = ''; activePlaylist = ''; libraryRows = 4;
      tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === button));
      $('#side').classList.remove('open'); render();
    };
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ playlists, recent, settings, collapsed, bubbleY: parseFloat(bubble.style.top) || state.bubbleY, bubbleSide: bubble.dataset.side || state.bubbleSide })); }
    catch { toast('浏览器储存空间不足，设置暂未保存'); }
  }
  function button(label, attrs = '') { return `<button type="button" ${attrs}>${label}</button>`; }
  function showDialog(title, body, onClick, onSubmit) {
    if (dialog.open) dialog.close();
    dialog.innerHTML = `<form><header><h2 id="playerFeatureDialogTitle">${esc(title)}</h2>${button('×', 'data-close aria-label="关闭"')}</header>${body}</form>`;
    dialog.onclick = e => {
      if (e.target === dialog || e.target.closest('[data-close]')) { dialog.close(); return; }
      onClick?.(e);
    };
    dialog.querySelector('form').onsubmit = e => { e.preventDefault(); onSubmit?.(new FormData(e.target)); };
    dialog.showModal();
  }
  function editPlaylist(playlist, addedId = '') {
    showDialog(playlist ? '重命名歌单' : '新建歌单', `<label>歌单名称<input name="name" maxlength="60" required value="${esc(playlist?.name || '')}" placeholder="例如：夜晚的 IU"></label><button type="submit">保存歌单</button><p class="feature-note">保存在当前浏览器，不会同步到其他设备。</p>`, null, data => {
      const name = String(data.get('name') || '').trim();
      if (!name) { dialog.querySelector('input').setCustomValidity('请输入歌单名称'); dialog.querySelector('input').reportValidity(); return; }
      if (playlist) playlist.name = name;
      else { const p = { id: crypto.randomUUID(), name, ids: addedId ? [addedId] : [] }; playlists.push(p); activePlaylist = p.id; }
      persist(); dialog.close(); render(); toast(addedId ? '已创建歌单并添加歌曲' : '歌单已保存');
    });
    dialog.querySelector('input').oninput = e => e.target.setCustomValidity('');
  }
  function addToPlaylist(id) {
    showDialog('加入歌单', `<div class="feature-stack">${playlists.map(p => button(`${esc(p.name)} · ${p.ids.length} 首`, `data-add-playlist="${esc(p.id)}"`)).join('')}${button('＋ 新建歌单', 'data-new-playlist')}</div>`, e => {
      if (e.target.closest('[data-new-playlist]')) { editPlaylist(null, id); return; }
      const p = playlists.find(p => p.id === e.target.closest('[data-add-playlist]')?.dataset.addPlaylist);
      if (!p) return;
      if (p.ids.includes(id)) { toast('这首歌已在歌单中'); return; }
      p.ids.push(id); persist(); dialog.close(); render(); toast('已加入歌单');
    });
  }
  function nextToPlay(id) {
    const ids = playbackQueueIds().filter(item => item !== id);
    const current = tracks[selected]?.id;
    if (!ids.includes(current)) ids.unshift(current);
    ids.splice(ids.indexOf(current) + 1, 0, id);
    queueSource = 'custom'; queueIds = ids; save(); renderQueue(); toast('已安排为下一首');
  }
  function showSongMenu(id) {
    const track = tracks.find(t => t.id === id); if (!track) return;
    showDialog(titleFor(track), `<div class="feature-stack">${button('加入歌单', 'data-song-menu="playlist"')}${button('下一首播放', 'data-song-menu="next"')}${button('加入播放列表', 'data-song-menu="queue"')}</div>`, e => {
      const action = e.target.closest('[data-song-menu]')?.dataset.songMenu;
      if (!action) return; dialog.close();
      if (action === 'playlist') addToPlaylist(id);
      if (action === 'next') nextToPlay(id);
      if (action === 'queue') addTrackToQueue(id);
    });
  }
  $('#grid').addEventListener('click', e => {
    const add = e.target.closest('[data-card-action="add"]');
    if (!add) return; e.stopImmediatePropagation(); showSongMenu(add.closest('[data-id]').dataset.id);
  }, true);
  const playlistAction = document.createElement('button');
  playlistAction.type = 'button'; playlistAction.textContent = '加入歌单';
  playlistAction.onclick = () => { const id = actionTrackId; closeTrackAction(); addToPlaylist(id); };
  $('.track-action-cancel').before(playlistAction);
  const oldRender = render;
  render = function () {
    document.body.dataset.libraryMode = mode;
    document.body.classList.toggle('album-overview-open', mode === 'albums' && !libraryAlbum);
    document.body.classList.toggle('record-tracks-open', mode === 'albums' && Boolean(libraryAlbum));
    const personal = ['playlists', 'recent'].includes(mode);
    const favorite = favorites.has(tracks[selected]?.id);
    for (const node of [$('.fav'), $('.mini-fav')]) node.textContent = favorite ? '♥' : '♡';
    $('.mini-fav').classList.toggle('is-favorite', favorite);
    $('.mini-fav').setAttribute('aria-pressed', String(favorite));
    $('.mini-fav').setAttribute('aria-label', favorite ? '取消收藏当前歌曲' : '收藏当前歌曲');
    if (!personal) { $('#grid').classList.remove('hidden'); oldRender(); }
    personalPanel.classList.toggle('hidden', !personal);
    $('#grid').classList.toggle('hidden', personal);
    if (!personal) return;
    $('#shelf').classList.add('hidden'); subShelf.classList.add('hidden'); more.classList.add('hidden'); $('#empty').classList.add('hidden');
    const p = playlists.find(p => p.id === activePlaylist);
    const ids = mode === 'recent' ? recent : p?.ids || [];
    const visible = ids.map(id => tracks.find(t => t.id === id)).filter(t => `${titleFor(t)} ${t.zh}`.toLowerCase().includes(query));
    visibleTrackIds = visible.map(t => t.id); $('#count').textContent = mode === 'recent' || p ? `${visible.length} 首` : `${playlists.length} 个歌单`;
    if (mode === 'playlists' && !p) {
      const matches = playlists.filter(p => p.name.toLowerCase().includes(query));
      $('#count').textContent = `${matches.length} 个歌单`;
      personalPanel.innerHTML = `<div class="feature-toolbar">${button('＋ 新建歌单', 'data-create')}</div><p class="feature-note">你的歌单保存在本浏览器。</p><div class="playlist-grid">${matches.map(p => button(`<img src="${esc(coverFor(tracks.find(t => t.id === p.ids[0]) || tracks[0]))}" alt=""><strong>${esc(p.name)}</strong><small>${p.ids.length} 首</small>`, `data-open-playlist="${esc(p.id)}"`)).join('')}</div>${matches.length ? '' : '<p class="feature-note">没有匹配的歌单。新建一个歌单，把喜欢的 IU 歌曲放在一起。</p>'}`;
      return;
    }
    personalPanel.innerHTML = `<div class="feature-toolbar">${p ? button('← 歌单', 'data-back') : ''}<h2>${esc(p?.name || '最近播放')}</h2>${p ? button('改名', 'data-rename') + button('删除', 'data-delete') : button('清空记录', 'data-clear-recent')}</div><div class="feature-toolbar">${button('播放全部', 'data-play-all')}${button('随机播放', 'data-shuffle-all')}</div><div>${visible.map(t => `<div class="personal-song"><button type="button" data-personal-play="${esc(t.id)}"><img src="${esc(coverFor(t))}" alt=""><span><strong>${esc(titleFor(t))}</strong><small>${esc(t.zh || t.release)}</small></span></button>${button('＋', `data-song-add="${esc(t.id)}" aria-label="歌曲操作"`)}${p ? button('↑', `data-song-up="${esc(t.id)}" aria-label="向前移动"`) + button('↓', `data-song-down="${esc(t.id)}" aria-label="向后移动"`) + button('×', `data-song-remove="${esc(t.id)}" aria-label="从歌单移除"`) : ''}</div>`).join('')}</div>${visible.length ? '' : '<p class="feature-note">还没有歌曲。双击歌曲卡片，选择列表图标即可加入歌单。</p>'}`;
  };
  personalPanel.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    const p = playlists.find(p => p.id === activePlaylist);
    if (b.hasAttribute('data-create')) editPlaylist();
    if (b.dataset.openPlaylist) { activePlaylist = b.dataset.openPlaylist; render(); }
    if (b.hasAttribute('data-back')) { activePlaylist = ''; render(); }
    if (b.hasAttribute('data-rename') && p) editPlaylist(p);
    if (b.hasAttribute('data-delete') && p) showDialog('删除歌单？', `<p>只删除“${esc(p.name)}”的歌单记录，不影响歌曲和收藏。</p>${button('确认删除', 'data-confirm-delete')}`, event => {
      if (!event.target.closest('[data-confirm-delete]')) return;
      playlists = playlists.filter(item => item !== p); activePlaylist = ''; persist(); dialog.close(); render();
    });
    if (b.hasAttribute('data-clear-recent')) showDialog('清空最近播放？', button('确认清空', 'data-confirm-clear'), event => {
      if (!event.target.closest('[data-confirm-clear]')) return; recent = []; persist(); dialog.close(); render();
    });
    if (b.dataset.songAdd) showSongMenu(b.dataset.songAdd);
    if (p && b.dataset.songRemove) { p.ids = p.ids.filter(id => id !== b.dataset.songRemove); persist(); render(); }
    const moving = b.dataset.songUp || b.dataset.songDown;
    if (p && moving) { const i = p.ids.indexOf(moving), j = i + (b.dataset.songUp ? -1 : 1); if (j >= 0 && j < p.ids.length) { [p.ids[i], p.ids[j]] = [p.ids[j], p.ids[i]]; persist(); render(); } }
    if (b.hasAttribute('data-play-all') || b.hasAttribute('data-shuffle-all')) {
      if (!visibleTrackIds.length) { toast('列表里还没有歌曲'); return; }
      queueIds = [...visibleTrackIds]; queueSource = 'custom'; playbackMode = b.hasAttribute('data-shuffle-all') ? 'shuffle' : 'list'; save(); setPlaybackModeUi();
      const id = queueIds[playbackMode === 'shuffle' ? Math.floor(Math.random() * queueIds.length) : 0]; await selectTrack(tracks.findIndex(t => t.id === id), true);
    }
    if (b.dataset.personalPlay) await playTrackFromCurrentView(b.dataset.personalPlay);
  };
  const modeBar = document.createElement('div'); modeBar.className = 'queue-modes';
  modeBar.innerHTML = [['shuffle', '⇄ 随机播放'], ['one', '↻¹ 单曲循环'], ['list', '↻ 列表循环']].map(([id, label]) => button(label, `data-queue-mode="${id}"`)).join('');
  $('.queue-list').before(modeBar);
  const oldModeUi = setPlaybackModeUi;
  setPlaybackModeUi = function () { oldModeUi(); modeBar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.queueMode === playbackMode))); };
  modeBar.onclick = e => { const value = e.target.closest('[data-queue-mode]')?.dataset.queueMode; if (value) { playbackMode = value; save(); setPlaybackModeUi(); } };
  const oldQueue = renderQueue;
  renderQueue = function () {
    oldQueue(); const rows = $('.queue-list').querySelectorAll('.queue-row');
    rows.forEach((row, index) => { const tools = document.createElement('div'); tools.className = 'queue-order'; tools.innerHTML = button('↑', `data-queue-move="-1" aria-label="向前移动" ${index === 0 ? 'disabled' : ''}`) + button('↓', `data-queue-move="1" aria-label="向后移动" ${index === rows.length - 1 ? 'disabled' : ''}`); row.append(tools); });
  };
  $('.queue-list').addEventListener('click', e => {
    const b = e.target.closest('[data-queue-move]'); if (!b) return;
    e.stopImmediatePropagation(); const ids = playbackQueueIds(), i = ids.indexOf(b.closest('[data-queue-id]').dataset.queueId), j = i + Number(b.dataset.queueMove);
    if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]]; queueIds = ids; queueSource = 'custom'; save(); renderQueue();
  }, true);
  function applySettings() {
    $('#lyrics').style.setProperty('--lyric-size', `${settings.size}px`);
    $('#lyrics').classList.toggle('hide-translation', !settings.translation);
    if (currentAudio) syncLyricsAt(currentAudio.currentTime, true);
  }
  function showSettings() {
    showDialog('播放与歌词设置', `<label>歌词字号<select name="size">${[16, 18, 20, 24, 28, 30].map(n => `<option value="${n}" ${settings.size === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label><input name="translation" type="checkbox" ${settings.translation ? 'checked' : ''}>显示翻译</label><label>歌词同步微调（毫秒，正值提前）<input name="offset" type="number" min="-5000" max="5000" step="100" value="${settings.offset}"></label><label>定时停止<select name="sleep"><option value="keep">${sleepAfterSong ? '当前歌曲结束停止' : sleepUntil ? `剩余约 ${Math.max(1, Math.ceil((sleepUntil - Date.now()) / 60000))} 分钟` : '未开启'}</option><option value="0">关闭定时</option><option value="15">15 分钟</option><option value="30">30 分钟</option><option value="60">60 分钟</option><option value="end">当前歌曲结束</option></select></label><button type="submit">保存设置</button>`, null, data => {
      settings.size = Number(data.get('size')); settings.translation = data.has('translation'); settings.offset = Math.max(-5000, Math.min(5000, Number(data.get('offset')) || 0));
      const sleep = data.get('sleep'); if (sleep !== 'keep') { sleepAfterSong = sleep === 'end'; sleepUntil = Number(sleep) > 0 ? Date.now() + Number(sleep) * 60000 : 0; }
      persist(); applySettings(); dialog.close(); updateSleepUi(); toast('设置已保存');
    });
  }
  const settingsButton = document.createElement('button'); settingsButton.type = 'button'; settingsButton.className = 'player-settings'; settingsButton.textContent = '设置'; settingsButton.onclick = showSettings;
  $('.queue-close').before(settingsButton);
  const lyricSettings = settingsButton.cloneNode(true); lyricSettings.classList.add('lyric-settings'); lyricSettings.onclick = showSettings; $('#side .close').before(lyricSettings);
  const coverControls = document.createElement('div'); coverControls.className = 'lyric-cover-controls'; coverControls.id = 'lyricArtwork';
  coverControls.innerHTML = '<button type="button" class="lyric-prev" aria-label="上一首"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M18 5 8 12l10 7Z"/></svg></button><button type="button" class="lyric-cover-play" aria-label="播放"><span class="lyric-cover-status" aria-hidden="true">▶</span></button><button type="button" class="lyric-next" aria-label="下一首"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M6 5l10 7-10 7Z"/></svg></button>';
  $('#cover').before(coverControls); coverControls.querySelector('.lyric-cover-play').prepend($('#cover'));
  coverControls.querySelector('.lyric-prev').onclick = () => stepTrack(-1);
  coverControls.querySelector('.lyric-next').onclick = () => stepTrack(1);
  let suppressCoverClickUntil = 0;
  const coverPlay = coverControls.querySelector('.lyric-cover-play');
  coverPlay.onclick = () => { if (performance.now() >= suppressCoverClickUntil) playCurrent(); };
  const lyricOnlyButton = document.createElement('button'); lyricOnlyButton.type = 'button'; lyricOnlyButton.className = 'lyric-only-toggle';
  lyricOnlyButton.setAttribute('aria-controls', 'lyricArtwork');
  lyricOnlyButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 14 7-7 7 7"/></svg>';
  lyricSettings.before(lyricOnlyButton);
  function setLyricsOnly(value) {
    $('#side').classList.toggle('lyrics-only', value);
    lyricOnlyButton.setAttribute('aria-expanded', String(!value));
    lyricOnlyButton.setAttribute('aria-label', value ? '显示封面和播放控制' : '隐藏封面，只看歌词');
    lyricOnlyButton.title = value ? '显示封面' : '纯歌词';
  }
  lyricOnlyButton.onclick = () => setLyricsOnly(!$('#side').classList.contains('lyrics-only'));
  let artworkDrag = null;
  coverPlay.addEventListener('pointerdown', e => { if (e.button === 0) artworkDrag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }; });
  coverPlay.addEventListener('pointermove', e => {
    if (!artworkDrag || artworkDrag.id !== e.pointerId) return;
    const dy = e.clientY - artworkDrag.y, dx = e.clientX - artworkDrag.x;
    if (Math.hypot(dx, dy) > 10) { artworkDrag.moved = true; coverPlay.setPointerCapture(e.pointerId); }
    if (!artworkDrag.moved) return;
    e.preventDefault(); coverPlay.style.setProperty('--cover-drag', `${Math.max(-64, Math.min(0, dy))}px`);
  });
  function finishArtworkDrag(e) {
    if (!artworkDrag || artworkDrag.id !== e.pointerId) return;
    const dy = e.clientY - artworkDrag.y, dx = e.clientX - artworkDrag.x;
    if (artworkDrag.moved) suppressCoverClickUntil = performance.now() + 600;
    if (e.type === 'pointerup' && dy < -48 && Math.abs(dy) > Math.abs(dx)) setLyricsOnly(true);
    artworkDrag = null; coverPlay.style.removeProperty('--cover-drag');
  }
  coverPlay.addEventListener('pointerup', finishArtworkDrag); coverPlay.addEventListener('pointercancel', finishArtworkDrag);
  setLyricsOnly(false);
  const lyricProgress = document.createElement('div'); lyricProgress.className = 'lyric-progress';
  lyricProgress.innerHTML = '<input type="range" min="0" max="1000" step="1" value="0" aria-label="歌词页播放进度"><div><time class="lyric-elapsed">0:00</time><time class="lyric-duration">0:00</time></div>';
  coverControls.after(lyricProgress);
  let seeking = false;
  const lyricSeek = lyricProgress.querySelector('input');
  lyricSeek.addEventListener('pointerdown', () => { seeking = true; });
  lyricSeek.addEventListener('pointerup', () => { seeking = false; syncProgress(); });
  lyricSeek.addEventListener('pointercancel', () => { seeking = false; syncProgress(); });
  lyricSeek.oninput = () => {
    if (!currentAudio || !Number.isFinite(currentAudio.duration) || currentAudio.duration <= 0) return;
    currentAudio.currentTime = Number(lyricSeek.value) / 1000 * currentAudio.duration;
    lyricSeek.style.setProperty('--seek-progress', `${Number(lyricSeek.value) / 10}%`);
    syncProgress(); syncLyricsAt(currentAudio.currentTime, true);
  };
  function syncLyricsVisibility() { root.body.classList.toggle('lyrics-open', $('#side').classList.contains('open')); }
  new MutationObserver(syncLyricsVisibility).observe($('#side'), { attributes: true, attributeFilter: ['class'] });
  function updateSleepUi() { settingsButton.textContent = sleepAfterSong ? '本首结束停止' : sleepUntil ? `定时 ${Math.max(1, Math.ceil((sleepUntil - Date.now()) / 60000))} 分钟` : '设置'; }
  function checkSleep() { if (sleepUntil && Date.now() >= sleepUntil) { sleepUntil = 0; currentAudio?.pause(); updateSleepUi(); toast('已按定时停止播放'); } }
  setInterval(() => { checkSleep(); updateSleepUi(); }, 1000);
  document.addEventListener('visibilitychange', checkSleep);
  const oldEnded = handleEnded;
  handleEnded = async function () { if (sleepAfterSong || (sleepUntil && Date.now() >= sleepUntil)) { sleepAfterSong = false; sleepUntil = 0; setPlayingUi(false); updateSleepUi(); toast('已按定时停止播放'); return; } await oldEnded(); };
  const oldPlaying = setPlayingUi;
  setPlayingUi = function (playing) {
    oldPlaying(playing); bubble.classList.toggle('is-playing', playing);
    const label = playing ? '暂停' : '播放';
    bubble.querySelector('.bubble-status').textContent = playing ? 'Ⅱ' : '▶';
    bubble.querySelector('.bubble-status').setAttribute('aria-label', label);
    coverControls.querySelector('.lyric-cover-play').setAttribute('aria-label', label);
    coverControls.querySelector('.lyric-cover-status').textContent = playing ? 'Ⅱ' : '▶';
    if (playing) { const id = tracks[selected]?.id; recent = [id, ...recent.filter(item => item !== id)].slice(0, 100); persist(); if (mode === 'recent') render(); }
  };
  const oldChoose = choose;
  choose = async function (...args) { await oldChoose(...args); bubble.querySelector('img').src = coverFor(tracks[selected]); bubble.title = `${titleFor(tracks[selected])} · 展开播放器`; syncProgress(); };
  const oldProgress = syncProgress;
  syncProgress = function () {
    oldProgress(); const value = Number($('.mini-progress').value);
    bubble.style.setProperty('--progress', `${value / 10}%`);
    const duration = Number.isFinite(currentAudio?.duration) ? currentAudio.duration : 0;
    const position = currentAudio?.currentTime || 0;
    const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    if (!seeking) lyricSeek.value = String(value);
    lyricSeek.disabled = duration <= 0; lyricSeek.style.setProperty('--seek-progress', `${Number(lyricSeek.value) / 10}%`);
    lyricProgress.querySelector('.lyric-elapsed').textContent = time(position);
    lyricProgress.querySelector('.lyric-duration').textContent = time(duration);
    checkSleep();
  };
  function setCollapsed(value) { collapsed = value; mini.classList.toggle('player-collapsed', value); bubble.hidden = !value; persist(); }
  miniCover.onclick = e => { e.stopPropagation(); setCollapsed(true); };
  let drag = null, suppressClick = false;
  function positionBubble(x, y) {
    const view = bubble.ownerDocument.defaultView, width = view.innerWidth, height = view.innerHeight;
    const side = x < width / 2 ? 'left' : 'right'; bubble.dataset.side = side;
    bubble.style.left = side === 'left' ? '12px' : `${Math.max(12, width - 72)}px`;
    bubble.style.top = `${Math.max(12, Math.min(y, height - 150))}px`;
  }
  bubble.addEventListener('pointerdown', e => { if (e.button !== 0 || e.target.closest('.bubble-status')) return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: bubble.offsetLeft, top: bubble.offsetTop, moved: false }; suppressClick = false; });
  bubble.addEventListener('pointermove', e => { if (!drag || drag.id !== e.pointerId) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 6) { drag.moved = true; bubble.setPointerCapture(e.pointerId); } if (!drag.moved) return; e.preventDefault(); bubble.style.left = `${drag.left + dx}px`; bubble.style.top = `${drag.top + dy}px`; });
  function endDrag(e) { if (!drag || drag.id !== e.pointerId) return; suppressClick = drag.moved; positionBubble(bubble.offsetLeft + 30, bubble.offsetTop); drag = null; persist(); }
  bubble.addEventListener('pointerup', endDrag); bubble.addEventListener('pointercancel', endDrag);
  bubble.onclick = e => { if (suppressClick) { suppressClick = false; return; } if (e.target.closest('.bubble-status')) { e.stopPropagation(); playCurrent(); return; } setCollapsed(false); };
  bubble.oncontextmenu = e => e.preventDefault(); bubble.ondragstart = e => e.preventDefault();
  function resizeBubble() { const view = bubble.ownerDocument.defaultView; positionBubble(bubble.dataset.side === 'left' ? 0 : view.innerWidth, parseFloat(bubble.style.top) || Number(state.bubbleY) || view.innerHeight - 180); }
  bubble.dataset.side = state.bubbleSide || 'right'; resizeBubble(); window.addEventListener('resize', resizeBubble);
  window.UAENA_PLAYER = {
    lyricOffset: () => settings.offset,
    mount(target) {
      if (root === target) return; root = target;
      host = target.createElement('div'); host.className = 'player-host'; target.body.append(host); host.append(target.adoptNode(mini));
      for (const node of [bubble, $('.queue-sheet'), $('.track-action'), $('.toast'), dialog, tutorialDialog]) target.body.append(target.adoptNode(node));
      target.defaultView.addEventListener('resize', resizeBubble); target.addEventListener('visibilitychange', checkSleep);
      target.addEventListener('contextmenu', e => { if (e.target.closest('.player-host,.queue-sheet,.track-action,.player-bubble')) e.preventDefault(); });
      target.addEventListener('dragstart', e => { if (e.target.closest('.player-host,.queue-sheet,.track-action,.player-bubble')) e.preventDefault(); });
      resizeBubble(); setCollapsed(collapsed); syncLyricsVisibility();
    }
  };
  applySettings(); setPlaybackModeUi(); renderQueue(); setCollapsed(collapsed); bubble.querySelector('img').src = coverFor(tracks[selected]); setPlayingUi(Boolean(currentAudio && !currentAudio.paused));
})();

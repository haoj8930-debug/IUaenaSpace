const musicAppFrame = document.querySelector('#musicAppFrame');
const requestedView = new URLSearchParams(location.search).get('view');
if (['screen', 'merch', 'search', 'profile'].includes(requestedView)) setView(requestedView);
function syncMusicAppTheme() {
  musicAppFrame.contentWindow?.postMessage({ type: 'uaena-theme', light: document.body.classList.contains('theme-light') }, location.origin);
  musicAppFrame.contentWindow?.postMessage({ type: 'uaena-parent-view', view: document.body.dataset.activeView || 'music' }, location.origin);
  const photocard = document.querySelector('#photocardAppFrame');
  if (photocard?.contentWindow) photocard.contentWindow.postMessage({ type: 'uaena-theme', light: document.body.classList.contains('theme-light') }, location.origin);
  if (document.body.dataset.activeView === 'music') {
    requestAnimationFrame(() => musicAppFrame.contentWindow?.postMessage({ type: 'uaena-view-active' }, location.origin));
  }
}
musicAppFrame.addEventListener('load', () => {
  musicAppFrame.contentWindow.UAENA_PLAYER?.mount(document);
  syncMusicAppTheme();
});
new MutationObserver(syncMusicAppTheme).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-active-view'] });
addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== musicAppFrame.contentWindow) return;
  if (event.data?.type === 'uaena-navigate' && ['music', 'screen', 'merch', 'search', 'profile'].includes(event.data.view)) {
    setView(event.data.view);
    scrollTo(0, 0);
  }
  if (event.data?.type === 'uaena-theme-change') applyTheme(event.data.light ? 'light' : 'dark');
});
document.querySelector('.photocard-entry').addEventListener('click', event => {
  event.preventDefault();
  const frame = document.querySelector('#photocardAppFrame');
  if (!frame.getAttribute('src')) frame.src = './photocards.html?embedded=1';
  setView('photocards'); scrollTo(0, 0);
});
document.querySelector('#photocardAppFrame').addEventListener('load', syncMusicAppTheme);
addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== document.querySelector('#photocardAppFrame').contentWindow) return;
  if (event.data?.type === 'uaena-navigate' && event.data.view === 'merch') setView('merch');
});

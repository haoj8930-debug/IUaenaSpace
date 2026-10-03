const musicAppFrame = document.querySelector('#musicAppFrame');
const requestedView = new URLSearchParams(location.search).get('view');
if (['screen', 'merch', 'search', 'profile'].includes(requestedView)) setView(requestedView);
function syncMusicAppTheme() {
  musicAppFrame.contentWindow?.postMessage({ type: 'uaena-theme', light: document.body.classList.contains('theme-light') }, location.origin);
  musicAppFrame.contentWindow?.postMessage({ type: 'uaena-parent-view', view: document.body.dataset.activeView || 'music' }, location.origin);
  if (document.body.dataset.activeView === 'music') {
    requestAnimationFrame(() => musicAppFrame.contentWindow?.postMessage({ type: 'uaena-view-active' }, location.origin));
  }
}
musicAppFrame.addEventListener('load', syncMusicAppTheme);
new MutationObserver(syncMusicAppTheme).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-active-view'] });
addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== musicAppFrame.contentWindow) return;
  if (event.data?.type === 'uaena-navigate' && ['music', 'screen', 'merch', 'search', 'profile'].includes(event.data.view)) {
    setView(event.data.view);
    scrollTo(0, 0);
  }
  if (event.data?.type === 'uaena-theme-change') applyTheme(event.data.light ? 'light' : 'dark');
});

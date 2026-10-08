/* Run before CSS and the first body paint; never erase personal library data. */
(() => {
  let mode;
  const music = location.pathname.endsWith('/app-preview.html');
  const cards = location.pathname.endsWith('/photocards.html');
  try {
    mode = localStorage.getItem('iu-theme-mode-v1');
    if (parent === window && music) mode = localStorage.getItem('uaena-music-light') === 'true' ? 'light' : 'dark';
    if (parent === window && cards) mode = localStorage.getItem('iu-photocard-theme') || 'light';
  } catch {}
  if (!['light','dark'].includes(mode)) mode = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  window.uaenaInitialTheme = mode;
  document.documentElement.dataset.initialTheme = mode;
  document.documentElement.style.colorScheme = mode;
  window.uaenaApplyInitialTheme = () => {
    document.body.classList.toggle(music ? 'light' : cards ? 'dark' : 'theme-light', cards ? mode === 'dark' : mode === 'light');
  };
})();

// Inline SVG avoids CSS image-mask layers disappearing during iOS compositing.
(() => {
  const paths = {
    headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    tv: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="m7 2 5 5 5-5"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8H7a3 3 0 1 1 3-3l2 3Zm0 0h5a3 3 0 1 0-3-3l-2 3Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>'
  };
  function renderIcons(root = document) {
    root.querySelectorAll('.navIcon').forEach(icon => {
      const name = Object.keys(paths).find(name => icon.classList.contains(`navIcon--${name}`));
      if (name) {
        icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
        const label = { headphones: '音乐', tv: '影视', gift: '开箱', search: '搜索', profile: '我的' }[name];
        const button = icon.closest('button'); if (button) { button.setAttribute('aria-label', label); button.title = label; }
      }
    });
  }
  window.UAENA_NAV_ICONS = renderIcons; renderIcons();
})();

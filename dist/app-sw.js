const CACHE_NAME = "uaena-app-preview-v18";
const ASSETS = [
  "app-preview.html",
  "app.webmanifest",
  "data/local-albums.js",
  "data/audio-sources.js",
  "data/song-titles.js",
  "data/local-lyrics.js",
  "app-library.js",
  "app-core.js",
  "app-library.css",
  "ui-glass.css",
  "assets/uaena-symbol-dark.png",
  "assets/uaena-symbol-light.png",
  "assets/bg-uaena-dark-landscape.png",
  "assets/bg-uaena-dark-portrait.png",
  "assets/bg-uaena-light-landscape.png",
  "assets/bg-uaena-light-portrait.png",
  "assets/covers/lilac.jpg",
  "assets/covers/love-poem.jpg",
  "assets/covers/palette.jpg",
  "assets/icons/gift.svg",
  "assets/icons/headphones.svg",
  "assets/icons/search.svg",
  "assets/icons/tv.svg",
  "assets/icons/user-round.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname.startsWith("/audio/")) {
    event.respondWith(fetch(event.request));
    return;
  }
  if (['document', 'script', 'style'].includes(event.request.destination)) {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok && new URL(event.request.url).origin === location.origin) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
      }
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        if (response.ok && new URL(event.request.url).origin === location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});

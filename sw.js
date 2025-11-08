// Service Worker for Cabin Control PWA (GitHub Pages friendly)
const CACHE_NAME = 'cabin-control-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => (name !== CACHE_NAME ? caches.delete(name) : undefined)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // For navigations (address bar, install launch, link clicks), serve index.html as a SPA fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For other requests, try cache first then network.
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});

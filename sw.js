const CACHE_NAME = 'tictactoe-glass-v1';
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './bg2.jpg'
];

// Install the service worker and cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

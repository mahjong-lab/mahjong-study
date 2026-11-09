/**
 * Service Worker: 麻雀ファーストステップ & 麻雀トレーニングボード (sw.js)
 * キャッシュ戦略: Network-First (常に最新を取得し、オフライン時はキャッシュで起動)
 */
const CACHE_NAME = 'mahjong-study-v20261109_v14';
const PRECACHE_ASSETS = [
  './',
  './beginner.html',
  './index.html',
  './css/mahjong.css',
  './js/shared/tile-renderer.js',
  './js/shared/sound-engine.js',
  './js/shared/term-dict.js',
  './js/shared/share-helper.js',
  './js/data/beginner-questions.js',
  './js/data/main-questions.js',
  './js/beginner-app.js',
  './js/main-app.js',
  './manifest.json',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // http/https のみ対象（chrome-extension等は無視）
  if (!req.url.startsWith('http')) return;

  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const respClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, respClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(req).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (req.mode === 'navigate') {
            return caches.match('./beginner.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});

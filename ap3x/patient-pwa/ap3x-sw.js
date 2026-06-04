// AutoSkill OS™ — Employee Learning PWA Service Worker
// Offline-first caching for Employee Learning Portal
// v3 — force reload lesson content

const CACHE_NAME   = 'autoskill-employee-v5';
const OFFLINE_PAGE = './index.html';

const PRECACHE_ASSETS = [
  './index.html',
  './patient.css',
  './patient-app.js?v=3',
  './manifest.json',
  './ap3x-sw.js',
  './chart.js',
];

// ── Install: pre-cache core assets ────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge ALL old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: NETWORK-FIRST for JS/CSS so updates land immediately ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = event.request.url;
  const isAsset = /\.(js|css|json)(\?.*)?$/.test(url);

  if (isAsset) {
    // Network-first for scripts/styles — always fresh, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match(OFFLINE_PAGE)))
    );
  } else {
    // Cache-first for HTML/images
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request)
          .then(response => {
            if (response && response.status === 200 && response.type !== 'opaque') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached || caches.match(OFFLINE_PAGE));
        return cached || networkFetch;
      })
    );
  }
});

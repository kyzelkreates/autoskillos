// AutoSkill OS™ — Employee Learning PWA Service Worker
// Offline-first caching for Employee Learning Portal
// Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
// v7 — Cleanup run: contamination fix + beforeinstallprompt install handler added

const CACHE_NAME   = 'autoskill-employee-v16';
const PWA_SCOPE    = '/ap3x/patient-pwa/';
const PWA_SCOPE_NEW = '/ap3x/employee-pwa/'; // canonical alias — served via Vercel rewrite
const OFFLINE_PAGE = '/ap3x/patient-pwa/index.html';

const PRECACHE_ASSETS = [
  '/ap3x/patient-pwa/index.html',
  '/ap3x/patient-pwa/patient.css',
  '/ap3x/patient-pwa/ai-coach-engine.js?v=14',
  '/ap3x/employee-pwa/ai-coach-engine.js?v=14',
  '/ap3x/patient-pwa/patient-app.js?v=14',
  '/ap3x/patient-pwa/manifest.json',
  '/ap3x/patient-pwa/ap3x-sw.js',
  '/ap3x/patient-pwa/chart.js',
  '/ap3x/employee-pwa/',
  '/ap3x/employee-pwa/index.html',
  '/icons/as-logo.png',
  '/icons/as-192.png',
  '/icons/as-512.png',
  '/icons/as-maskable-192.png',
  '/icons/as-maskable-512.png',
  '/icons/as-apple-touch.png',
  '/icons/favicon.ico',
];

// ── Install: pre-cache core assets ────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge ALL old caches ────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[AutoSkill SW v11] Deleting old cache:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: handle navigation + assets ─────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url      = new URL(event.request.url);
  const isAsset  = /\.(js|css|json|png|ico|webp|svg)(\?.*)?$/.test(url.pathname);
  const isNavReq = event.request.mode === 'navigate';

  // Navigation requests within PWA scope → serve PWA index.html
  // This allows refresh at /ap3x/patient-pwa/ to work offline
  if (isNavReq && url.pathname.startsWith(PWA_SCOPE)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE).then(r => r || caches.match('/ap3x/patient-pwa/index.html')))
    );
    return;
  }

  // DO NOT intercept navigation outside PWA scope (dashboard stays separate)
  if (isNavReq && !url.pathname.startsWith(PWA_SCOPE)) return;

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
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for HTML/images within scope
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

// AutoSkill OS™ — Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
// SW scope: /ap3x/patient-pwa/ — canonical route alias: /ap3x/employee-pwa/ (Vercel rewrite)
// Does NOT intercept dashboard routes

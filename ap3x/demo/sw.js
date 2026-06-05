// AutoSkill OS™ — Control Dashboard Service Worker
// Caches the dashboard shell only — NOT a PWA install SW
// The installable Employee Learning PWA SW is at: /ap3x/patient-pwa/ap3x-sw.js
// v6 — Run 12: removed patient-demo, updated cache list

const CACHE_NAME = 'autoskill-dashboard-v6';
const PRECACHE_ASSETS = [
  './index.html',
  './clinician-demo.html',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// AutoSkill OS™ — Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
// NOTE: This SW does NOT register the dashboard as an installable PWA.
// Only /ap3x/patient-pwa/ with its own ap3x-sw.js is installable.

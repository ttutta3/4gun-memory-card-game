const CACHE = 'speak-to-speak-v33';
const FILES = ['./', './index.html', './mockup.html', './manifest.webmanifest', './icon.svg', './assets/poster-emblem.png', './assets/card-back.webp?v=6', './assets/card-back-comparison.webp?v=1', './assets/ChosunKm.woff', './assets/card-front/business.webp?v=2', './assets/card-front/economics.webp?v=2', './assets/card-front/global-leadership.webp?v=2', './assets/card-front/global-convergence.webp?v=2', './assets/card-front/liberal-arts.webp?v=2', './assets/card-front/education.webp?v=2', './assets/card-front/social-sciences.webp?v=2', './assets/card-front/arts.webp?v=2', './assets/card-front/confucian-studies.webp?v=2', './assets/card-front/undergraduate-studies.webp?v=2', './assets/card-front/new-business.webp?v=1', './assets/card-front/new-economics.webp?v=1', './assets/card-front/new-global-leadership.webp?v=1', './assets/card-front/new-global-convergence.webp?v=1', './assets/card-front/new-liberal-arts.webp?v=1', './assets/card-front/new-education.webp?v=1', './assets/card-front/new-social-sciences.webp?v=1', './assets/card-front/new-arts.webp?v=1', './assets/card-front/new-confucian-studies.webp?v=1', './assets/card-front/new-undergraduate-studies.webp?v=1'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    const cacheKey = new URL(request.url).pathname.endsWith('/mockup.html') ? './mockup.html' : './index.html';
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(cacheKey, copy));
      return response;
    }).catch(() => caches.match(cacheKey)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});


const CACHE = 'speak-to-speak-v24';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './assets/poster-emblem.png', './assets/card-back.webp?v=5', './assets/ChosunKm.woff', './assets/card-front/business.webp?v=2', './assets/card-front/economics.webp?v=2', './assets/card-front/global-leadership.webp?v=2', './assets/card-front/global-convergence.webp?v=2', './assets/card-front/liberal-arts.webp?v=2', './assets/card-front/education.webp?v=2', './assets/card-front/social-sciences.webp?v=2', './assets/card-front/arts.webp?v=2', './assets/card-front/confucian-studies.webp?v=2', './assets/card-front/undergraduate-studies.webp?v=2'];

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
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put('./index.html', copy));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});


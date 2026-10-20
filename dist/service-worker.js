const CACHE = 'speak-to-speak-v22';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './assets/poster-emblem.png', './assets/card-back.webp?v=4', './assets/ChosunKm.woff', './assets/card-front/business.webp', './assets/card-front/economics.webp', './assets/card-front/global-leadership.webp', './assets/card-front/global-convergence.webp', './assets/card-front/liberal-arts.webp', './assets/card-front/education.webp', './assets/card-front/social-sciences.webp', './assets/card-front/arts.webp', './assets/card-front/confucian-studies.webp', './assets/card-front/undergraduate-studies.webp'];

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


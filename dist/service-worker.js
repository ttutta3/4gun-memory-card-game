const CACHE = 'speak-to-speak-v21';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './assets/poster-emblem.png', './assets/card-back.png?v=3', './assets/ChosunKm.woff', './assets/card-front/business.png', './assets/card-front/economics.png', './assets/card-front/global-leadership.png', './assets/card-front/global-convergence.png', './assets/card-front/liberal-arts.png', './assets/card-front/education.png', './assets/card-front/social-sciences.png', './assets/card-front/arts.png', './assets/card-front/confucian-studies.png', './assets/card-front/undergraduate-studies.png'];

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


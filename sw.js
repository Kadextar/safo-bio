/* Safo Restaurant — service worker.
   Меню должно открываться у гостя даже при слабом Wi-Fi в горах,
   поэтому оболочку и картинки держим в кэше. */

const VERSION = 'safo-v1';
const CORE = `${VERSION}-core`;
const RUNTIME = `${VERSION}-runtime`;

// Минимум, чтобы меню открылось офлайн
const CORE_ASSETS = [
  './',
  './index.html',
  './menu/',
  './menu/index.html',
  './manifest.webmanifest',
  './assets/logo-safo-black.png',
  './assets/hero-restaurant.jpg',
  './assets/menu/hero.jpg',
  './assets/fonts/fonts.css',
  './assets/pwa-192.png',
  './assets/pwa-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE)
      // addAll падает целиком, если хоть один файл не найден — кладём по одному
      .then((cache) => Promise.all(
        CORE_ASSETS.map((url) => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Страницы: сначала сеть (чтобы правки долетали), офлайн — из кэша
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./menu/index.html')))
    );
    return;
  }

  // Картинки, шрифты, стили: сначала кэш — открывается мгновенно
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

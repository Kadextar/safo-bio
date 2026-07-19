/* Safo Restaurant — service worker.
   Меню должно открываться у гостя даже при слабом Wi-Fi в горах,
   поэтому оболочку и картинки держим в кэше. */

const VERSION = 'safo-v2';
const CORE = `${VERSION}-core`;
const RUNTIME = `${VERSION}-runtime`;

// Весь сайт офлайн: обе страницы, шрифты, фото категорий, иконки
const CORE_ASSETS = [
  './',
  './index.html',
  './menu/',
  './menu/index.html',
  './manifest.webmanifest',
  './assets/fonts/fonts.css',
  './assets/fonts/Manrope-400-cyrillic.woff2',
  './assets/fonts/Manrope-400-latin-ext.woff2',
  './assets/fonts/Manrope-400-latin.woff2',
  './assets/fonts/Manrope-500-cyrillic.woff2',
  './assets/fonts/Manrope-500-latin-ext.woff2',
  './assets/fonts/Manrope-500-latin.woff2',
  './assets/fonts/Manrope-600-cyrillic.woff2',
  './assets/fonts/Manrope-600-latin-ext.woff2',
  './assets/fonts/Manrope-600-latin.woff2',
  './assets/fonts/Manrope-700-cyrillic.woff2',
  './assets/fonts/Manrope-700-latin-ext.woff2',
  './assets/fonts/Manrope-700-latin.woff2',
  './assets/fonts/PlayfairDisplay-600-cyrillic.woff2',
  './assets/fonts/PlayfairDisplay-600-latin-ext.woff2',
  './assets/fonts/PlayfairDisplay-600-latin.woff2',
  './assets/logo-safo-black.png',
  './assets/hero-restaurant.jpg',
  './assets/og-safo.jpg',
  './assets/safo.vcf',
  './assets/pwa-192.png',
  './assets/pwa-512.png',
  './assets/pwa-maskable-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon.svg',
  './assets/favicon-32.png',
  './assets/favicon-16.png',
  './assets/menu/deserty.jpg',
  './assets/menu/garniry.jpg',
  './assets/menu/goryachie-zakuski.jpg',
  './assets/menu/goryachie.jpg',
  './assets/menu/hero.jpg',
  './assets/menu/holodnye.jpg',
  './assets/menu/mangal.jpg',
  './assets/menu/pasta.jpg',
  './assets/menu/pizza.jpg',
  './assets/menu/ryba.jpg',
  './assets/menu/salaty.jpg',
  './assets/menu/steyki.jpg',
  './assets/menu/supy.jpg',
  './assets/menu/zakuski.jpg',
  './assets/menu/zavtraki.jpg'
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

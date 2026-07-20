/* Safo Restaurant — service worker.
   Меню должно открываться у гостя даже при слабом Wi-Fi в горах,
   поэтому оболочку и картинки держим в кэше. */

const VERSION = 'safo-v3';
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
  './assets/hero-restaurant.webp',
  './assets/og-safo.jpg',
  './assets/safo.vcf',
  './assets/pwa-192.png',
  './assets/pwa-512.png',
  './assets/pwa-maskable-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon.svg',
  './assets/favicon-32.png',
  './assets/favicon-16.png',
  './assets/menu/deserty.webp',
  './assets/menu/garniry.webp',
  './assets/menu/goryachie-zakuski.webp',
  './assets/menu/goryachie.webp',
  './assets/menu/hero.webp',
  './assets/menu/holodnye.webp',
  './assets/menu/mangal.webp',
  './assets/menu/pasta.webp',
  './assets/menu/pizza.webp',
  './assets/menu/ryba.webp',
  './assets/menu/salaty.webp',
  './assets/menu/steyki.webp',
  './assets/menu/supy.webp',
  './assets/menu/zakuski.webp',
  './assets/menu/zavtraki.webp',
  './assets/dish/achichuk.webp',
  './assets/dish/angliyskiy-zavtrak.webp',
  './assets/dish/assorti-fermerskih-syrov.webp',
  './assets/dish/assorti-gril-po-vostochnomu.webp',
  './assets/dish/assorti-kolbasok.webp',
  './assets/dish/assorti-miks-steykov.webp',
  './assets/dish/assorti-smerrebredov.webp',
  './assets/dish/baltiyskiy-set.webp',
  './assets/dish/barani-semechki.webp',
  './assets/dish/bedro-kurinoe.webp',
  './assets/dish/bolshoy-zelenyy-salat.webp',
  './assets/dish/bon-file-s-kartofelem-po-domashnemu.webp',
  './assets/dish/bon-file.webp',
  './assets/dish/brokkoli-zapechennaya-s-sousom-gamadari-.webp',
  './assets/dish/burrata-s-tomatami-i-sousom-pesto.webp',
  './assets/dish/cezar-s-krevetkami.webp',
  './assets/dish/cezar-s-kuricey.webp',
  './assets/dish/chakka.webp',
  './assets/dish/chechevichnyy-sup-s-tykvennymi-semenami.webp',
  './assets/dish/chesnochnye-grenki.webp',
  './assets/dish/chirokchi.webp',
  './assets/dish/choban-salat.webp',
  './assets/dish/dolma.webp',
  './assets/dish/domashnie-marinady.webp',
  './assets/dish/dumgaza-bychiy-hvost-s-kartofelem.webp',
  './assets/dish/file-dorado-so-shpinatom-i-cherri.webp',
  './assets/dish/file-lososya-s-ikornym-sousom-i-sparzhey.webp',
  './assets/dish/file-minon-s-kartofelnym-pyure-i-sousom-.webp',
  './assets/dish/francuzskiy-zavtrak.webp',
  './assets/dish/fruktovaya-narezka.webp',
  './assets/dish/glazunya-iz-3-h-yaic.webp',
  './assets/dish/gril-salat-v-pechi-josper.webp',
  './assets/dish/hlebnaya-korzina.webp',
  './assets/dish/kare-yagnenka-s-sezonnymi-ovoschami.webp',
  './assets/dish/kartofel-bebi-s-parmezanom.webp',
  './assets/dish/kartofelnoe-pyure.webp',
  './assets/dish/kazan-kebab-iz-baraniny.webp',
  './assets/dish/kazan-kebab-iz-govyadiny.webp',
  './assets/dish/kazy.webp',
  './assets/dish/kolbaski-barani.webp',
  './assets/dish/kolbaski-pikantnye.webp',
  './assets/dish/kolbaski-s-syrom.webp',
  './assets/dish/koreyka-yagnenka.webp',
  './assets/dish/kostnyy-mozg-s-sousom-chimichurri.webp',
  './assets/dish/krem-sup-iz-brokkoli.webp',
  './assets/dish/krem-sup-iz-shampinonov.webp',
  './assets/dish/krevetki-tempura.webp',
  './assets/dish/krevetki-v-souse-bisk.webp',
  './assets/dish/krylyshki-s-sousom-bbq.webp',
  './assets/dish/krylyshki-v-souse-tom-yam.webp',
  './assets/dish/kurdyuk.webp',
  './assets/dish/kurinye-krylyshki.webp',
  './assets/dish/kurinyy-sup-s-domashney-lapshoy.webp',
  './assets/dish/losos-zapechennyy-s-ovoschami.webp',
  './assets/dish/mastava-tashkentskaya.webp',
  './assets/dish/medalony-s-maconi-i-sousom-arrabyata.webp',
  './assets/dish/miks-salat-s-avokado-i-tigrovymi-krevetk.webp',
  './assets/dish/miks-shashlyk.webp',
  './assets/dish/miks-svezhih-ovoschey-s-syrom-feta.webp',
  './assets/dish/molotyy-shashlyk.webp',
  './assets/dish/myaso-po-kutaisski.webp',
  './assets/dish/nacionalnyy-zavtrak-set.webp',
  './assets/dish/navaristaya-shurpa-iz-baraniny.webp',
  './assets/dish/norvezhskiy-losos-s-salsoy-iz-mango.webp',
  './assets/dish/nuhat-shurak.webp',
  './assets/dish/omlet-s-syrom-i-tomatami.webp',
  './assets/dish/ovoschnoe-sote.webp',
  './assets/dish/ovoschnoy-salat-s-orehovym-sousom.webp',
  './assets/dish/ovoschnoy-shashlyk.webp',
  './assets/dish/ovsyanaya-kasha.webp',
  './assets/dish/pasta-kacho-e-pepe.webp',
  './assets/dish/pasta-orzo-s-kurinym-file-i-gribami.webp',
  './assets/dish/penne-arrabyata.webp',
  './assets/dish/pivnaya-doska.webp',
  './assets/dish/ribay-s-kartofelem-bebi-i-sousom-romesko.webp',
  './assets/dish/ris-na-paru.webp',
  './assets/dish/risovaya-kasha-s-yagodami.webp',
  './assets/dish/rizotto-s-tigrovymi-krevetkami.webp',
  './assets/dish/salatnyy-miks-s-tuncom.webp',
  './assets/dish/samsa-s-baraninoy.webp',
  './assets/dish/samsa-s-govyadinoy.webp',
  './assets/dish/san-sebastyan.webp',
  './assets/dish/set-brusket.webp',
  './assets/dish/sezonnye-ovoschi-na-grile.webp',
  './assets/dish/shakshuka.webp',
  './assets/dish/shashlyk-iz-semgi.webp',
  './assets/dish/shokoladnoe-sufle.webp',
  './assets/dish/slivochnyy-sup-s-lososem-i-krevetkami.webp',
  './assets/dish/spagetti-boloneze.webp',
  './assets/dish/steyk-klassik-s-brokkoli-i-sousom-pepper.webp',
  './assets/dish/svezhaya-narezka-ovoschey.webp',
  './assets/dish/syrniki-s-yagodnym-sousom.webp',
  './assets/dish/tropicheskoe-assorti.webp',
  './assets/dish/vitello-tonnato.webp',
  './assets/dish/vok-s-ovoschami-v-souse-teriyaki.webp',
  './assets/dish/yagodnyy-milfey.webp',
  './assets/dish/yazyk-telyachiy-s-sousom-romesko.webp',
  './assets/dish/zakuska-k-pivu.webp',
  './assets/dish/zhiz-iz-bon-file.webp',
  './assets/dish/zhiz-iz-koreyki-yagnenka.webp'
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

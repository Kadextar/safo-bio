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
  './assets/menu/zavtraki.jpg',
  './assets/dish/achichuk.jpg',
  './assets/dish/angliyskiy-zavtrak.jpg',
  './assets/dish/assorti-fermerskih-syrov.jpg',
  './assets/dish/assorti-gril-po-vostochnomu.jpg',
  './assets/dish/assorti-kolbasok.jpg',
  './assets/dish/assorti-miks-steykov.jpg',
  './assets/dish/assorti-smerrebredov.jpg',
  './assets/dish/baltiyskiy-set.jpg',
  './assets/dish/barani-semechki.jpg',
  './assets/dish/bedro-kurinoe.jpg',
  './assets/dish/bolshoy-zelenyy-salat.jpg',
  './assets/dish/bon-file-s-kartofelem-po-domashnemu.jpg',
  './assets/dish/bon-file.jpg',
  './assets/dish/brokkoli-zapechennaya-s-sousom-gamadari-.jpg',
  './assets/dish/burrata-s-tomatami-i-sousom-pesto.jpg',
  './assets/dish/cezar-s-krevetkami.jpg',
  './assets/dish/cezar-s-kuricey.jpg',
  './assets/dish/chakka.jpg',
  './assets/dish/chechevichnyy-sup-s-tykvennymi-semenami.jpg',
  './assets/dish/chesnochnye-grenki.jpg',
  './assets/dish/chirokchi.jpg',
  './assets/dish/choban-salat.jpg',
  './assets/dish/dolma.jpg',
  './assets/dish/domashnie-marinady.jpg',
  './assets/dish/dumgaza-bychiy-hvost-s-kartofelem.jpg',
  './assets/dish/file-dorado-so-shpinatom-i-cherri.jpg',
  './assets/dish/file-lososya-s-ikornym-sousom-i-sparzhey.jpg',
  './assets/dish/file-minon-s-kartofelnym-pyure-i-sousom-.jpg',
  './assets/dish/francuzskiy-zavtrak.jpg',
  './assets/dish/fruktovaya-narezka.jpg',
  './assets/dish/glazunya-iz-3-h-yaic.jpg',
  './assets/dish/gril-salat-v-pechi-josper.jpg',
  './assets/dish/hlebnaya-korzina.jpg',
  './assets/dish/kare-yagnenka-s-sezonnymi-ovoschami.jpg',
  './assets/dish/kartofel-bebi-s-parmezanom.jpg',
  './assets/dish/kartofelnoe-pyure.jpg',
  './assets/dish/kazan-kebab-iz-baraniny.jpg',
  './assets/dish/kazan-kebab-iz-govyadiny.jpg',
  './assets/dish/kazy.jpg',
  './assets/dish/kolbaski-barani.jpg',
  './assets/dish/kolbaski-pikantnye.jpg',
  './assets/dish/kolbaski-s-syrom.jpg',
  './assets/dish/koreyka-yagnenka.jpg',
  './assets/dish/kostnyy-mozg-s-sousom-chimichurri.jpg',
  './assets/dish/krem-sup-iz-brokkoli.jpg',
  './assets/dish/krem-sup-iz-shampinonov.jpg',
  './assets/dish/krevetki-tempura.jpg',
  './assets/dish/krevetki-v-souse-bisk.jpg',
  './assets/dish/krylyshki-s-sousom-bbq.jpg',
  './assets/dish/krylyshki-v-souse-tom-yam.jpg',
  './assets/dish/kurdyuk.jpg',
  './assets/dish/kurinye-krylyshki.jpg',
  './assets/dish/kurinyy-sup-s-domashney-lapshoy.jpg',
  './assets/dish/losos-zapechennyy-s-ovoschami.jpg',
  './assets/dish/mastava-tashkentskaya.jpg',
  './assets/dish/medalony-s-maconi-i-sousom-arrabyata.jpg',
  './assets/dish/miks-salat-s-avokado-i-tigrovymi-krevetk.jpg',
  './assets/dish/miks-shashlyk.jpg',
  './assets/dish/miks-svezhih-ovoschey-s-syrom-feta.jpg',
  './assets/dish/molotyy-shashlyk.jpg',
  './assets/dish/myaso-po-kutaisski.jpg',
  './assets/dish/nacionalnyy-zavtrak-set.jpg',
  './assets/dish/navaristaya-shurpa-iz-baraniny.jpg',
  './assets/dish/norvezhskiy-losos-s-salsoy-iz-mango.jpg',
  './assets/dish/nuhat-shurak.jpg',
  './assets/dish/omlet-s-syrom-i-tomatami.jpg',
  './assets/dish/ovoschnoe-sote.jpg',
  './assets/dish/ovoschnoy-salat-s-orehovym-sousom.jpg',
  './assets/dish/ovoschnoy-shashlyk.jpg',
  './assets/dish/ovsyanaya-kasha.jpg',
  './assets/dish/pasta-kacho-e-pepe.jpg',
  './assets/dish/pasta-orzo-s-kurinym-file-i-gribami.jpg',
  './assets/dish/penne-arrabyata.jpg',
  './assets/dish/pivnaya-doska.jpg',
  './assets/dish/ribay-s-kartofelem-bebi-i-sousom-romesko.jpg',
  './assets/dish/ris-na-paru.jpg',
  './assets/dish/risovaya-kasha-s-yagodami.jpg',
  './assets/dish/rizotto-s-tigrovymi-krevetkami.jpg',
  './assets/dish/salatnyy-miks-s-tuncom.jpg',
  './assets/dish/samsa-s-baraninoy.jpg',
  './assets/dish/samsa-s-govyadinoy.jpg',
  './assets/dish/san-sebastyan.jpg',
  './assets/dish/set-brusket.jpg',
  './assets/dish/sezonnye-ovoschi-na-grile.jpg',
  './assets/dish/shakshuka.jpg',
  './assets/dish/shashlyk-iz-semgi.jpg',
  './assets/dish/shokoladnoe-sufle.jpg',
  './assets/dish/slivochnyy-sup-s-lososem-i-krevetkami.jpg',
  './assets/dish/spagetti-boloneze.jpg',
  './assets/dish/steyk-klassik-s-brokkoli-i-sousom-pepper.jpg',
  './assets/dish/svezhaya-narezka-ovoschey.jpg',
  './assets/dish/syrniki-s-yagodnym-sousom.jpg',
  './assets/dish/tropicheskoe-assorti.jpg',
  './assets/dish/vitello-tonnato.jpg',
  './assets/dish/vok-s-ovoschami-v-souse-teriyaki.jpg',
  './assets/dish/yagodnyy-milfey.jpg',
  './assets/dish/yazyk-telyachiy-s-sousom-romesko.jpg',
  './assets/dish/zakuska-k-pivu.jpg',
  './assets/dish/zhiz-iz-bon-file.jpg',
  './assets/dish/zhiz-iz-koreyki-yagnenka.jpg'
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

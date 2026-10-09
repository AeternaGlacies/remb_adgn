// ADGN PWA — cache réservé aux fichiers statiques, jamais aux demandes ni factures.
const CACHE_PREFIX = 'adgn-portail-';
const CACHE_NAME = 'adgn-portail-20261008-5';
const APP_SHELL = [
  './', './index.html', './style.css', './app.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './icons/favicon-32.png', './assets/adgn-epee.png', './assets/adgn-logo.png'
];
const APP_ASSETS = new Set(APP_SHELL.filter(path => path !== './').map(path => new URL(path, self.registration.scope).pathname));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => (key.startsWith(CACHE_PREFIX) || key.startsWith('adgn-remboursements-')) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  const isNavigation = request.mode === 'navigate';
  const isAsset = APP_ASSETS.has(url.pathname);
  if (!isNavigation && !isAsset) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic' && !url.searchParams.has('_')) {
        const cache = await caches.open(CACHE_NAME);
        // N'enregistrer que la page d'accueil et les ressources de l'application.
        if (isAsset || (isNavigation && (url.pathname === new URL('./', self.registration.scope).pathname || url.pathname.endsWith('/index.html')))) {
          await cache.put(request, response.clone());
        }
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request, {ignoreSearch: true});
      if (cached) return cached;
      if (isNavigation) {
        const fallback = await caches.match(new URL('./index.html', self.registration.scope));
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});

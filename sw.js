// La mise en cache concerne seulement l’interface publique, jamais les factures ou demandes.
const CACHE_NAME = 'adgn-remboursements-pwa-epee-v4';
const APP_FILES = ['./', './index.html', './style.css', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './assets/adgn-epee.png'];
self.addEventListener('install', e => {
 e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
 e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
 const request = e.request;
 if(request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
 e.respondWith(fetch(request).then(response => {
  if(response.ok){const clone=response.clone();caches.open(CACHE_NAME).then(c => c.put(request,clone));}
  return response;
 }).catch(() => caches.match(request).then(response => response || (request.mode==='navigate' ? caches.match('./index.html') : Response.error()))));
});

// Keeps the site's own files on the phone, so Workouts opens in a gym with no signal.
// The network is tried first and the saved copy is the fallback, so a new version shows up the next time there is a connection.
const CACHE = 'workouts-v1';
const FILES = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/plan.js', 'js/store.js', 'js/cloud.js', 'js/ui.js', 'manifest.json', 'img/icon.svg',
  'fonts/fira-sans-400.woff2', 'fonts/fira-sans-500.woff2', 'fonts/fira-sans-700.woff2', 'fonts/fira-sans-800.woff2'];

self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin) return;       // the account service is never cached
  event.respondWith(fetch(event.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return res;
  }).catch(() => caches.match(event.request).then(hit => hit || caches.match('index.html'))));
});

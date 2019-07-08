// // CACHE APP SHELL
const staticCacheName = 'brunoalves-static-v1';
const filesToCache = [
  'index.html',
  'assets/css/main.css',
  'assets/js/app.js',
];

this.addEventListener('install', (event) => {
  this.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(filesToCache);
    }),
  );
});

// Clear cache on activate
this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('brunoalves-static-')))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/404.html');
      })
  )
});

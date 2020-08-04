var CACHE_NAME = '2020-08-04 13:10';
var urlsToCache = [
  '/easy-timer/',
  '/easy-timer/mp3/bgm.mp3',
  '/easy-timer/mp3/suzume.mp3',
  '/easy-timer/mp3/niwatori.mp3',
  '/easy-timer/mp3/higurashi.mp3',
  '/easy-timer/mp3/semi.mp3',
  '/easy-timer/mp3/pipipi.mp3',
  '/easy-timer/mp3/kirakira.mp3',
  '/easy-timer/index.js',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/nosleep/0.11.0/NoSleep.min.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

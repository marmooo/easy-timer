var CACHE_NAME = '2022-05-14 10:20';
var urlsToCache = [
  "/easy-timer/",
  "/easy-timer/index.js",
  "/easy-timer/mp3/bgm.mp3",
  "/easy-timer/mp3/suzume.mp3",
  "/easy-timer/mp3/niwatori.mp3",
  "/easy-timer/mp3/higurashi.mp3",
  "/easy-timer/mp3/semi.mp3",
  "/easy-timer/mp3/pipipi.mp3",
  "/easy-timer/mp3/kirakira.mp3",
  "/easy-timer/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/nosleep.js@0.12.0/dist/NoSleep.min.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

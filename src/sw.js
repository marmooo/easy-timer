const CACHE_NAME = "2024-03-21 09:20";
const urlsToCache = [
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
  "https://cdn.jsdelivr.net/npm/nosleep.js@0.12.0/dist/NoSleep.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});

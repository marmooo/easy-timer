var CACHE_NAME="2022-10-08 11:03",urlsToCache=["/easy-timer/","/easy-timer/index.js","/easy-timer/mp3/bgm.mp3","/easy-timer/mp3/suzume.mp3","/easy-timer/mp3/niwatori.mp3","/easy-timer/mp3/higurashi.mp3","/easy-timer/mp3/semi.mp3","/easy-timer/mp3/pipipi.mp3","/easy-timer/mp3/kirakira.mp3","/easy-timer/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css","https://cdn.jsdelivr.net/npm/nosleep.js@0.12.0/dist/NoSleep.min.js"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})
const CACHE_NAME="2024-06-23 00:00",urlsToCache=["/easy-timer/","/easy-timer/index.js","/easy-timer/mp3/bgm.mp3","/easy-timer/mp3/suzume.mp3","/easy-timer/mp3/niwatori.mp3","/easy-timer/mp3/higurashi.mp3","/easy-timer/mp3/semi.mp3","/easy-timer/mp3/pipipi.mp3","/easy-timer/mp3/kirakira.mp3","/easy-timer/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/nosleep.js@0.12.0/dist/NoSleep.min.js"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})
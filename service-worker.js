const VERSION = {
  STATIC: 'static-v1',
  DYNAMIC: 'dynamic-v1'
}

let PRECACHE = [
  '/content/offline.jpg',
  '/content/connection.js',
  '/offline.html',
  '/content/style.css',
  '/content/happy-cloud.png',
  '/content/sad-cloud.png'
] 

self.addEventListener('install', function (event) {
  console.log('Installing Service Worker: ', event);
  event.waitUntil(
    caches.open(VERSION.STATIC)
      .then(function (cache) {
        console.log('Precaching App Shell')
        cache.addAll(PRECACHE);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('Activating Service Worker: ', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== VERSION.STATIC && key !== VERSION.DYNAMIC) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the network
    fetch(event.request)
      .then(function(res) {
        return caches.open(VERSION.DYNAMIC)
          .then(function(cache) {
            // Put in cache if succeeds
            cache.put(event.request.url, res.clone());
            return res;
          })
      })
      .catch(function(err) {
          // Fallback to cache
          return caches.match(event.request)
            .then(function(res){
                if (res === undefined) { 
                  // get and return the offline page
                  return caches.match(new Request('/offline.html'))
                } 
                return res;
            })
      })
  );
});

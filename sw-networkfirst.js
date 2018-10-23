var CACHE_STATIC_NAME = 'static-v9';
var CACHE_DYNAMIC_NAME = 'dynamic-v9';

self.addEventListener('install', function (event) {
  console.log('Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('Precaching App Shell');
        cache.addAll([
            '/content/offline.jpg',
            '/content/connection.js',
            '/offline.html',
            '/content/style.css'
        ]);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('Removing old cache.', key);
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
        return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache) {
            // Put in cache if succeeds
            cache.put(event.request.url, res.clone());
            return res;
          })
      })
      .catch(function(err) {
          // Fallback to cache
          // return caches.match(event.request);
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


// const spCaches = {
//     'static': 'static-v1-networkfirst'
// };

// // Installation...
// self.addEventListener('install', function(event) {
//     console.log('SW v%s Installed at', spCaches.static, new Date().toLocaleTimeString()); 
//     self.skipWaiting(); // Installs and updates

//     event.waitUntil(
//         caches.open(spCaches.static)
//         .then(function (cache) {
//             return cache.addAll([
//                 '/content/offline.jpg',
//                 '/content/pwa.js',
//                 '/content/connection.js',
//                 '/offline.html'
//             ])
//         })
//     );
// });
 
// // Activation...
// self.addEventListener('activate', function(event) {
//     console.log('SW v%s Activated at', spCaches.static, new Date().toLocaleTimeString()); 

//     //lets remove any old caches we have setup previously
//     event.waitUntil(
//         caches.keys()
//         .then(function (keys) {
//             return Promise.all(keys.filter(function (key) {
//                 return !Object.values(spCaches).includes(key);
//             }).map(function (key) {
//                 return caches.delete(key);
//             }));
//         }));
// });


// // this is cache first
// self.addEventListener('fetch', function(event){
//     event.respondWith(
//         fetch(event.request).then(function(res){
//             return caches.open(spCaches.static).then(function(cache){
//                 if(!res.ok){
//                     return cache.match(event.request);
//                 } else {
//                     cache.put(event.request, res.clone());
//                     return res;
//                 }
//             })
//         })
//         // caches.match(event.request)
//         // .then(function (res) {
//         //     if (res) {
//         //         return res;
//         //     }

//         //     if (!navigator.onLine) {
//         //         return caches.match(new Request('/offline.html'))
//         //     }

//         //     return fetchAndUpdate(event.request); //if we get a request from the cache and not sure if we are offline, let's try and use the network.
//         // })
//     )
// })

// //update caches as the user navigates...
// function fetchAndUpdate(request) {
//     console.log('you here?')
//     return fetch(request)
//     .then(function (res) {
//         if (res) {
//             return caches.open(spCaches.static)
//             .then(function (cache){
//                 return cache.put(request, res.clone())
//                 .then(function (){
//                     return res;
//                 })
//             })
//         }
//     })
// }
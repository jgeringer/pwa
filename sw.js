importScripts('/content/sw-toolbox.js');

const spCaches = {
    'static': 'static-v6',
    'dynamic': 'dynamic-v6'
};

// Installation...
self.addEventListener('install', function(event) {
    console.log('SW v%s Installed at', spCaches.static, new Date().toLocaleTimeString()); 
    self.skipWaiting(); // Installs and updates

    event.waitUntil(
        caches.open(spCaches.static)
        .then(function (cache) {
            return cache.addAll([
                '/content/offline.jpg',
                '/content/pwa.js',
                '/content/connection.js',
                '/offline.html'
            ])
        })
    );
});
 
// Activation...
self.addEventListener('activate', function(event) {
    console.log('SW v%s Activated at', spCaches.static, new Date().toLocaleTimeString()); 

    //lets remove any old caches we have setup previously
    event.waitUntil(
        caches.keys()
        .then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return !Object.values(spCaches).includes(key);
            }).map(function (key) {
                return caches.delete(key);
            }));
        }));
});

//things inside this route get the cacheFirst pattern
toolbox.router.get('/content/*', toolbox.cacheFirst, {
    cache: {
        name: spCaches.static,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
    }
});

//things inside this route get the networkFirst pattern
//toolbox.router.get('/*', toolbox.networkFirst, {
toolbox.router.get('/*', function(request, values, options) {
    return toolbox.networkFirst(request, values, options)
    .catch(function(err){
        return caches.match(new Request('/offline.html'))
    });
}, {
    networkTimeoutSeconds: 1, // after 1 second of waiting for a response, it gave up and served from the cache
    cache: {
        name: spCaches.dynamic,
        maxAgeSeconds: 2 // only holds two in the database
    }
});


// self.addEventListener('fetch', function(event){
//     event.respondWith(
//         caches.match(event.request)
//         .then(function (res) {
//             if (res) {
//                 return res;
//             }

//             if (!navigator.onLine) {
//                 return caches.match(new Request('/offline.html'))
//             }

//             return fetchAndUpdate(event.request); //if we get a request from the cache and not sure if we are offline, let's try and use the network.
//         })
//     )
//})


// //update caches as the user navigates...
// function fetchAndUpdate(request) {
//     return fetch(request)
//     .then(function (res) {
//         if (res) {
//             return caches.open(version)
//             .then(function (cache){
//                 return cache.put(request, res.clone())
//                 .then(function (){
//                     return res;
//                 })
//             })
//         }
//     })
// }

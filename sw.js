const version = 'v4';

// Installation...
self.addEventListener('install', function(event) {
    console.log('SW v%s Installed at', version, new Date().toLocaleTimeString()); 
    self.skipWaiting(); // Installs and updates

    event.waitUntil(
        caches.open(version)
        .then(function (cache) {
            return cache.addAll([
                '/img/offline.jpg',
                '/scripts/pwa.js',
                '/scripts/connection.js',
                'offline.html'
            ])
        })
    );
});

// Activation...
self.addEventListener('activate', function(event) {
    console.log('SW v%s Activated at', version, new Date().toLocaleTimeString()); 

    //lets remove any old caches we have setup previously
    event.waitUntil(
        caches.keys()
        .then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return key !== version;
            }).map(function (key) {
                return caches.delete(key);
            }));
        }));
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function (res) {
            if (res) {
                return res;
            }

            if (!navigator.onLine) {
                return caches.match(new Request('/offline.html'))
            }

            return fetchAndUpdate(event.request); //if we get a request from the cache and not sure if we are offline, let's try and use the network.
        })
    )

    // if (!navigator.onLine) {
    //     event.respondWith(new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } } ));
    // } else {
    //     console.log(event.request.url);
    //     event.respondWith(fetch(event.request)); // This adds a gear next to the request in the network panel   
    // }
})


//update caches as the user navigates...
function fetchAndUpdate(request) {
    return fetch(request)
    .then(function (res) {
        if (res) {
            return caches.open(version)
            .then(function (cache){
                return cache.put(request, res.clone())
                .then(function (){
                    return res;
                })
            })
        }
    })
}
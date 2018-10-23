const spCaches = {
    'static': 'static-v1x'
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


// this is cache first
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
})

//update caches as the user navigates...
function fetchAndUpdate(request) {
    console.log('you here?')
    return fetch(request)
    .then(function (res) {
        if (res) {
            return caches.open(spCaches.static)
            .then(function (cache){
                return cache.put(request, res.clone())
                .then(function (){
                    return res;
                })
            })
        }
    })
}
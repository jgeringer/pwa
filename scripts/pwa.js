if ('serviceWorker' in navigator){
    navigator.serviceWorker
        .register('/sw.js') //with scope param added, you can register multiple service workers on your site one for each directory
        .then(r => console.log('SW Registered'))
        .catch(console.error);
}
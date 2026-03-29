self.addEventListener('install', (e) => {
    console.log('[KVALIM] Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
    // For now, just let the app fetch data normally from your new PC
    e.respondWith(fetch(e.request));
});
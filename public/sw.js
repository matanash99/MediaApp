self.addEventListener('fetch', (e) => {
    // NEW: Bypass the Service Worker completely for video streams and media uploads
    if (e.request.url.includes('/play/') || e.request.url.includes('/uploads/')) {
        return; // This tells the Service Worker to step aside and let the browser handle it natively
    }

    // Otherwise, handle the request normally
    e.respondWith(fetch(e.request));
});
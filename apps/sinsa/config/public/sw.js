/* eslint-disable no-undef */
// sw.js

self.addEventListener('install', event => {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function () {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
            return true;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Optional: Get a list of all the current open windows/tabs under
  // our service worker's control, and force them to reload.
  // This can "unbreak" any open windows/tabs as soon as the new
  // service worker activates, rather than users having to manually reload.
  self.clients
    .matchAll({
      type: 'window',
    })
    .then(windowClients => {
      windowClients.forEach(windowClient => {
        windowClient.navigate(windowClient.url);
      });
    });
});

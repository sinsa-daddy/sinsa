import { cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
cleanupOutdatedCaches();

registerRoute(
  /\/api\/v2\/copilots\/cn-\d+\.json/,
  new NetworkFirst({
    cacheName: 'Copilots',
    networkTimeoutSeconds: 3,
  }),
  'GET',
);

const AVATAR_REGEXP = /^\/assets\/images\/avatars\/.+\.webp$/;

registerRoute(
  ({ url, sameOrigin, request }) =>
    sameOrigin &&
    AVATAR_REGEXP.test(url.pathname) &&
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'AurorianAvatars',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30
      }),
    ],
  }),
);

registerRoute(
  ({ sameOrigin, request }) => sameOrigin && request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'StaticHTML',
  }),
);

registerRoute(
  ({ sameOrigin, request }) => sameOrigin && request.destination === 'script',
  new CacheFirst({
    cacheName: 'StaticScripts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 128,
        maxAgeSeconds: 14 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ sameOrigin, request }) => sameOrigin && request.destination === 'image',
  new CacheFirst({
    cacheName: 'StaticImages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

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

// addPlugins([
//   {
//     async cacheDidUpdate({ request, cacheName, newResponse }) {
//       if (request.url.includes('api/v2/terms.json')) {
//         const windows = await self.clients.matchAll({
//           type: 'window',
//           includeUncontrolled: true,
//         });

//         const responseData = await newResponse.clone().json();
//         const payloadData = Array.isArray(responseData) ? responseData : [];

//         for (const win of windows) {
//           win.postMessage({
//             type: 'TERMS_UPDATE',
//             payload: { cacheName, updatedURL: request.url, terms: payloadData },
//           });
//         }
//       }
//     },
//   },
// ]);
// /**
//  * The precacheAndRoute() method efficiently caches and responds to
//  * requests for URLs in the manifest.
//  * See https://goo.gl/S9QRab
//  */
// precacheAndRoute(self.__WB_MANIFEST, {});

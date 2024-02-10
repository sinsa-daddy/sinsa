import {
  precacheAndRoute,
  addPlugins,
  cleanupOutdatedCaches,
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

skipWaiting();
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

addPlugins([
  {
    async cacheDidUpdate({ request, cacheName, newResponse }) {
      if (request.url.includes('api/v2/terms.json')) {
        const windows = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true,
        });

        const responseData = await newResponse.clone().json();
        const payloadData = Array.isArray(responseData) ? responseData : [];

        for (const win of windows) {
          win.postMessage({
            type: 'TERMS_UPDATE',
            payload: { cacheName, updatedURL: request.url, terms: payloadData },
          });
        }
      }
    },
  },
]);
/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
precacheAndRoute(self.__WB_MANIFEST, {});

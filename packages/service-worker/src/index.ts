import {
  precacheAndRoute,
  addPlugins,
  cleanupOutdatedCaches,
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { clientsClaim, skipWaiting } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

registerRoute(
  /\/api\/copilots\/\d+\.json/,
  new NetworkFirst({
    cacheName: 'Copilots',
    networkTimeoutSeconds: 3,
  }),
  'GET',
);

addPlugins([
  {
    async cacheDidUpdate({ request, cacheName, newResponse }) {
      if (request.url.includes('api/terms.json')) {
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

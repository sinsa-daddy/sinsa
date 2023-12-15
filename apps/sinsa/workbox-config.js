module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{json,html,css,webp,js,svg}'],
  globIgnores: ['**\/node_modules\/**\/*', '**\/api\/copilots\/*.json'],
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  skipWaiting: true,
  clientsClaim: true,
  additionalManifestEntries: [
    'https://registry.npmmirror.com/react/18.2.0/files/umd/react.production.min.js',
    'https://registry.npmmirror.com/dayjs/1.11.10/files/dayjs.min.js',
    'https://registry.npmmirror.com/antd/5.11.3/files/dist/antd.min.js',
    'https://registry.npmmirror.com/react-dom/18.2.0/files/umd/react-dom.production.min.js',
  ],
            runtimeCaching: [
             {
               method: 'GET',
               urlPattern: /\/api\/copilots\/\d+\.json/,
               handler: 'NetworkFirst',
               options: {
                 cacheName: 'Copilots',
                 networkTimeoutSeconds: 8,
               },
             },
          ],
};

module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{json,html,css,webp,js,svg}'],
  globIgnores: ['**/node_modules/**/*', '**/api/copilots/*.json'],
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  skipWaiting: true,
  clientsClaim: true,
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

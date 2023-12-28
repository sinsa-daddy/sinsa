// @ts-check
/** @type {import('workbox-build/build/types').InjectManifestOptions} */
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{json,html,css,webp,js,svg}'],
  globIgnores: ['**/node_modules/**/*', '**/api/copilots/*.json'],
  swDest: 'dist/sw.js',
  swSrc: require.resolve('@sinsa/service-worker/dist/es'),
};

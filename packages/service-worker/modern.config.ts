import { moduleTools, defineConfig } from '@modern-js/module-tools';

export default defineConfig({
  plugins: [moduleTools()],
  buildPreset: 'npm-library-es2015',
  buildConfig: {
    format: 'iife',
    define: {
      'process.env.NODE_ENV': process.env.NODE_ENV || 'production',
    },
    minify: 'esbuild',
  },
});

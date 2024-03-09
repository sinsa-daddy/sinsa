import { moduleTools, defineConfig } from '@modern-js/module-tools';

export default defineConfig({
  plugins: [moduleTools()],
  buildConfig: [
    {
      format: 'esm',
      target: 'es2021',
      buildType: 'bundle',
      outDir: './dist/es',
      dts: false,
    },
    {
      buildType: 'bundle',
      outDir: './dist/types',
      dts: {
        only: true,
      },
    },
  ],
});

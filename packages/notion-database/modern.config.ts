import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { testingPlugin } from '@modern-js/plugin-testing';

export default defineConfig({
  plugins: [moduleTools(), testingPlugin()],
  buildPreset: 'npm-library',
  testing: {
    jest: {
      // ...
      testEnvironment: 'node',
      // ...
    },
  },
});

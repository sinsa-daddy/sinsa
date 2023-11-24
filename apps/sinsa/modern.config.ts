import { appTools, defineConfig } from '@modern-js/app-tools';
import { fetchDataSourcePlugin } from './plugins/fetch-data-source-plugin';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  runtime: {
    router: {
      supportHtml5History: false,
    },
    state: true,
  },
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
    fetchDataSourcePlugin(),
  ],
  html: {
    title: '红油扳手作业站',
    favicon: './src/assets/wrench.svg',
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        cacheGroups: {
          antdesign: {
            test: /[\\/]node_modules[\\/](@ant-design[\\/]pro)/,
            name: 'lib-antd-pro',
            chunks: 'all',
          },
        },
      },
    },
  },
});

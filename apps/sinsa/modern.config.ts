import { appTools, defineConfig } from '@modern-js/app-tools';
import { GenerateSW } from 'workbox-webpack-plugin';
import { fetchDataSourcePlugin } from './plugins/fetch-data-source-plugin';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'webpack'>({
  runtime: {
    router: {
      supportHtml5History: false,
    },
    state: true,
  },
  plugins: [
    appTools({
      // bundler: 'experimental-rspack',
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
    },
  },
  output: {
    externals: {
      antd: 'antd',
      dayjs: 'dayjs',
      react: 'React',
      'react-dom': 'ReactDOM',
      // '@ant-design/pro-components': 'ProComponents',
    },
    distPath: {
      html: '',
    },
  },
  tools: {
    htmlPlugin: {
      filename: 'index.html',
    },
    webpack(_, { appendPlugins }) {
      appendPlugins(
        new GenerateSW({
          swDest: './sw.js',
          exclude: [/\.json$/, /\.js\.map$/, /\.LICENSE\.txt$/],
          skipWaiting: true,
          clientsClaim: true,
          additionalManifestEntries: [
            'https://registry.npmmirror.com/react/18.2.0/files/umd/react.production.min.js',
            'https://registry.npmmirror.com/dayjs/1.11.10/files/dayjs.min.js',
            'https://registry.npmmirror.com/antd/5.11.3/files/dist/antd.min.js',
            'https://registry.npmmirror.com/react-dom/18.2.0/files/umd/react-dom.production.min.js',
          ],
          runtimeCaching: [
            // {
            //   method: 'GET',
            //   urlPattern: /\/api\/copilots\/\d+\.json/,
            //   handler: 'NetworkFirst',
            //   options: {
            //     cacheName: 'Copilots',
            //     networkTimeoutSeconds: 8,
            //   },
            // },
            {
              method: 'GET',
              urlPattern: /\/api\/(aurorians|terms)\.json/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'AuroriansAndTerms',
                expiration: {
                  maxAgeSeconds: 60 * 60 * 2, // 2 hours
                },
              },
            },
          ],
        }),
      );
    },
  },
});

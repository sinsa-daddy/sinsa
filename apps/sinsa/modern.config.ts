import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appTools, defineConfig } from '@modern-js/app-tools';
import { updateNotionAurorians } from './plugins/update-notion-aurorians';
import { formatOutputPlugin } from './plugins/foramt-output';
import { fetchDataSourcePlugin } from './plugins/fetch-data-source-plugin';
import { fetchDataNext } from './plugins/fetch-data-next';
import { updateFeishuCopilots } from './plugins/update-feishu-copilots';

const __DIR_NAME = dirname(fileURLToPath(import.meta.url));

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  source: {
    exclude: [/api-worker/],
  },
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
    formatOutputPlugin(),
    updateNotionAurorians(),
    fetchDataNext(),
    updateFeishuCopilots(),
  ],
  html: {
    title: '红油扳手作业站',
    favicon: './src/assets/wrench.svg',
    crossorigin: 'anonymous',
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
      '@waline/client': 'Waline',
      'pinyin-pro': 'pinyinPro',
      axios: 'axios',
      '@ant-design/charts': 'Charts',
    },
    distPath: {
      html: '',
    },
    copy: [
      {
        from: resolve(__DIR_NAME, 'config', 'public', '**', '*.*'),
        context: resolve(__DIR_NAME, 'config', 'public'),
      },
      // {
      //   from: require.resolve('@sinsa/api-worker/dist/es/index.js'),
      //   to: resolve(__DIR_NAME, 'functions', 'api-worker', '[[catchAll]].js'),
      // },
    ],
  },
  tools: {
    htmlPlugin: {
      filename: 'index.html',
    },
    devServer: {
      proxy: {
        '/api-upload': {
          target: 'http://localhost:3000',
          pathRewrite: {
            '^/api-upload': '',
          },
        },
        '/api-worker': {
          target: 'http://127.0.0.1:12576',
        },
      },
    },
  },
});

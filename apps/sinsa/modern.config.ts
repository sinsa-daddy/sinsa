import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { appTools, defineConfig } from '@modern-js/app-tools';
import { updateNotionAurorians } from './plugins/update-notion-aurorians';
import { formatOutputPlugin } from './plugins/foramt-output';
import { fetchDataNext } from './plugins/fetch-data-next';
import { updateFeishuCopilots } from './plugins/update-feishu-copilots';

const __DIR_NAME = dirname(fileURLToPath(import.meta.url));

const __COMMIT_HASH__ = execSync('git rev-parse --short HEAD')
  .toString()
  .trim();
const __COMMIT_TIME__ = execSync(
  'git log -1 --date=format:"%Y-%m-%d %T%z" --format="%ad"',
)
  .toString()
  .trim();

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  source: {
    define: {
      __COMMIT_HASH__: JSON.stringify(__COMMIT_HASH__),
      __COMMIT_TIME__: JSON.stringify(__COMMIT_TIME__),
    },
  },
  runtime: {
    router: {
      supportHtml5History: process.env.NODE_ENV === 'production',
    },
    state: true,
  },
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
    formatOutputPlugin(),
    updateNotionAurorians(),
    fetchDataNext(),
    updateFeishuCopilots(),
  ],

  html: {
    title: '红油扳手作业站',
    favicon: 'https://s2.loli.net/2024/04/27/ugxX2Yr4qPBsNkD.png',
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

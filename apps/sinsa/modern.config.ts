import { appTools, defineConfig } from '@modern-js/app-tools';
import { formatOutputPlugin } from './plugins/foramt-output';
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
    formatOutputPlugin(),
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
  },
});

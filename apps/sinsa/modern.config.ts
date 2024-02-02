import { readdirSync } from 'fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appTools, defineConfig } from '@modern-js/app-tools';
import { first, groupBy, mapValues } from 'lodash-es';
import { formatOutputPlugin } from './plugins/foramt-output';
import { fetchDataSourcePlugin } from './plugins/fetch-data-source-plugin';

const __DIR_NAME = dirname(fileURLToPath(import.meta.url));

const AVATARS_PATH = resolve(__DIR_NAME, './src/assets/skins');
const AVATARS_FILENAMES = readdirSync(AVATARS_PATH);

type NameMap = { [key: string]: number };

function splitNames(names: NameMap, numSubsets: number): NameMap[] {
  // 初始化子集
  const subsets: NameMap[] = new Array(numSubsets).fill(null).map(() => ({}));

  // 按照数量从大到小的顺序对首字母进行排序
  const sortedNames = Object.keys(names).sort((a, b) => names[b] - names[a]);

  // 将每个名字添加到当前数量最小的子集中
  for (const letter of sortedNames) {
    const minSubset = subsets.reduce(
      (min, subset) =>
        Object.keys(subset).length === 0 || sum(subset) < sum(min)
          ? subset
          : min,
      subsets[0],
    );
    minSubset[letter] = (minSubset[letter] || 0) + names[letter];
  }

  return subsets;
}

// 辅助函数：计算 Map 中值的和
function sum(map: NameMap): number {
  return Object.values(map).reduce((total, count) => total + count, 0);
}

const namesMap: NameMap = mapValues(
  groupBy(AVATARS_FILENAMES, name => first(name)),
  array => array.length,
);

function createCacheGroups(k: number) {
  const cacheGroup: Record<
    string,
    { chunks: 'all'; name: string; test: RegExp }
  > = {};

  splitNames(namesMap, k).forEach(subset => {
    const range = Object.keys(subset).join('');

    const name = `asset-avatars-${range}`;

    cacheGroup[name] = {
      test: new RegExp(
        `src[\\\\/]assets[\\\\/]skins[\\\\/][${range}].*\\.webp$`,
      ),
      name,
      chunks: 'all',
    };
  });

  return cacheGroup;
}

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  source: {},
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
      override: {
        cacheGroups: {
          ...createCacheGroups(8),
        },
      },
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
      },
    },
  },
});

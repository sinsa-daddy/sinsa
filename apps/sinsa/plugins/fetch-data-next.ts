import { join } from 'node:path';
import type { CliPlugin } from '@modern-js/core';
import {
  NotionService,
  NotionEnvSchema,
  FeishuService,
  FeishuEnvSchema,
} from '@sinsa/datasource-generator';
import { ensureDir, writeJSON } from 'fs-extra';

function log(...args: any) {
  return console.log('[fetchDataNext]', ...args);
}

export function fetchDataNext(): CliPlugin {
  return {
    setup(api) {
      return {
        commands({ program }) {
          const { appDirectory } = api.useAppContext();

          /**
           * 输出静态目录
           */
          const OUTPUT_DIR = join(
            appDirectory,
            'config',
            'public',
            'api',
            'v2',
          );

          program.command('fetch-data-next').action(async () => {
            await ensureDir(OUTPUT_DIR);
            const env = NotionEnvSchema.and(FeishuEnvSchema).parse(process.env);

            const notion = new NotionService({
              notionToken: env.NOTION_READ_TOKEN,
              databaseIds: {
                aurorians: env.NOTION_AURORIAN_DATABASE_ID,
              },
            });

            // 1. 生成光灵数据
            const auroriansMap = await notion.getAuroriansMap();
            await writeJSON(join(OUTPUT_DIR, './aurorians.json'), auroriansMap);
            const keys = Object.keys(auroriansMap);
            console.log(`生成了 ${keys.length} 个光灵数据`);

            const feishu = new FeishuService({
              appId: env.FEISHU_APP_ID,
              appSecret: env.FEISHU_APP_SECRET,
              tableAppIds: {
                copilots: env.FEISHU_COPILOT_APP_ID,
              },
            });

            // 2. 获取作业表
            const { currentCopilotTable } = await feishu.getCopilotsTableMeta();
            if (!currentCopilotTable) {
              log('没有找到当前 HEAD 作业数据表');
              return;
            }
            console.log('123');
          });
        },
      };
    },
  };
}

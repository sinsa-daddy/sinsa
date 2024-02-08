import { join } from 'node:path';
import type { CliPlugin } from '@modern-js/core';
import { NotionService, NotionEnvSchema } from '@sinsa/datasource-generator';
import { ensureDir, writeJSON } from 'fs-extra';

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
            const env = NotionEnvSchema.parse(process.env);

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
          });
        },
      };
    },
  };
}

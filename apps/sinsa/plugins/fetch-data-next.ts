import { join } from 'node:path';
import type { CliPlugin } from '@modern-js/core';
import {
  NotionService,
  NotionEnvSchema,
  FeishuService,
  FeishuEnvSchema,
} from '@sinsa/datasource-generator';
import { copy, ensureDir, exists, writeJSON } from 'fs-extra';
import { groupBy } from 'lodash-es';
import { CopilotNextType } from '@sinsa/schema';

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
                terms: env.NOTION_TERM_DATABASE_ID,
              },
            });

            // 0. 生成首领数据
            const termsMap = await notion.getTermsMap();
            await writeJSON(
              join(OUTPUT_DIR, 'terms.json'),
              Object.values(termsMap),
            );
            const termsKeys = Object.keys(termsMap);
            console.log(`获取并生成了 ${termsKeys.length} 个首领数据`);

            // 1. 生成光灵数据
            const auroriansMap = await notion.getAuroriansMap();
            await writeJSON(join(OUTPUT_DIR, 'aurorians.json'), auroriansMap);
            const auroriansKeys = Object.keys(auroriansMap);
            console.log(`获取并生成了 ${auroriansKeys.length} 个光灵数据`);

            const feishu = new FeishuService({
              appId: env.FEISHU_APP_ID,
              appSecret: env.FEISHU_APP_SECRET,
              tableAppIds: {
                copilots: env.FEISHU_COPILOT_APP_ID,
              },
            });

            // 2. 获取作业表
            const { currentCopilotTable, archivedCopilotsTablesMap } =
              await feishu.getCopilotsTableMeta();
            if (!currentCopilotTable) {
              log('没有找到当前 HEAD 作业数据表');
              return;
            }

            await ensureDir(join(OUTPUT_DIR, 'copilots'));

            // 3. 生成 HEAD 数据表中的作业
            const copilotsMap = await feishu.getCopilotsMapByTableId(
              currentCopilotTable.table_id,
            );

            const headValues = Object.values(copilotsMap);

            log(`获取到了 HEAD 数据表中的 ${headValues.length} 条作业`);

            const headGroupedByTermId = groupBy(headValues, c => c.term_id);

            for (const [key, value] of Object.entries(headGroupedByTermId)) {
              const result = value.reduce((acc, next) => {
                return {
                  ...acc,
                  [next.copilot_id]: next,
                };
              }, {} as Record<CopilotNextType['copilot_id'], CopilotNextType>);

              const OUTPUT_COPILOT_PATH = join(
                OUTPUT_DIR,
                'copilots',
                `${key}.json`,
              );
              await writeJSON(OUTPUT_COPILOT_PATH, result);
              log(`已写入 ${key} 的作业到 ${OUTPUT_COPILOT_PATH}`);
            }

            const archivedCopilotsTablesValues = Object.values(
              archivedCopilotsTablesMap,
            );

            // 4. 生成归档作业
            const ARCHIVED_OUTPUT_PATH = join(
              OUTPUT_DIR,
              'copilots',
              'archived',
            );
            const allResults = await Promise.all(
              archivedCopilotsTablesValues.map(table =>
                exists(join(ARCHIVED_OUTPUT_PATH, table.name)),
              ),
            );
            if (allResults.every(v => v)) {
              // pass
            } else {
              await Promise.all(
                archivedCopilotsTablesValues.map(table =>
                  ensureDir(join(ARCHIVED_OUTPUT_PATH, table.name)),
                ),
              );
              for (const table of archivedCopilotsTablesValues) {
                const archivedCopilotsMap =
                  await feishu.getCopilotsMapByTableId(table.table_id);

                const archivedValues = Object.values(archivedCopilotsMap);

                log(
                  `获取到了 ARCHIVED (${table.name}) 数据表中的 ${archivedValues.length} 条作业`,
                );

                const archivedGroupedByTermId = groupBy(
                  archivedValues,
                  c => c.term_id,
                );

                for (const [key, value] of Object.entries(
                  archivedGroupedByTermId,
                )) {
                  const result = value.reduce((acc, next) => {
                    return {
                      ...acc,
                      [next.copilot_id]: next,
                    };
                  }, {} as Record<CopilotNextType['copilot_id'], CopilotNextType>);

                  const OUTPUT_COPILOT_PATH = join(
                    ARCHIVED_OUTPUT_PATH,
                    table.name,
                    `${key}.json`,
                  );
                  await writeJSON(OUTPUT_COPILOT_PATH, result);
                  log(`已写入 ${key} 的作业到 ${OUTPUT_COPILOT_PATH}`);
                }
              }
            }

            // 5. 合并归档作业
            for (const table of archivedCopilotsTablesValues) {
              const archivedTableDir = join(ARCHIVED_OUTPUT_PATH, table.name);

              await copy(archivedTableDir, join(OUTPUT_DIR, 'copilots'));

              log(`已拷贝 ${table.name} 到 copilots 目录下`);
            }
          });
        },
      };
    },
  };
}

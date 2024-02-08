import { CliPlugin } from '@modern-js/core';
import {
  FeishuEnvSchema,
  FeishuService,
  NotionEnvSchema,
  NotionService,
} from '@sinsa/datasource-generator';

function log(...args: any) {
  return console.log('[updateFeishuCopilots]', ...args);
}

export function updateFeishuCopilots(): CliPlugin {
  return {
    setup() {
      return {
        commands({ program }) {
          program.command('update-feishu-copilots').action(async () => {
            const env = FeishuEnvSchema.and(NotionEnvSchema).parse(process.env);

            const feishu = new FeishuService({
              appId: process.env.FEISHU_UPLOAD_APP_ID!,
              appSecret: process.env.FEISHU_UPLOAD_APP_SECRET!,
              tableAppIds: {
                copilots: env.FEISHU_COPILOT_APP_ID,
              },
            });

            const { unknownTablesMap, currentCopilotTable } =
              await feishu.getCopilotsTableMeta();

            if (!currentCopilotTable) {
              log('未发现可添加的数据表');
              return;
            }

            const source = Object.values(unknownTablesMap).find(t =>
              t.name.startsWith('荒典'),
            );

            if (!source) {
              log('未发现遗留数据表来源');
              return;
            }

            // 1. 获取光灵 map 用于转换名字
            const notion = new NotionService({
              notionToken: env.NOTION_READ_TOKEN,
              databaseIds: {
                aurorians: env.NOTION_AURORIAN_DATABASE_ID,
              },
            });

            const auroriansMap = await notion.getAuroriansMap();
            log(
              `已从 notion 获取到 ${
                Object.keys(auroriansMap).length
              } 个光灵信息`,
            );

            // 1. 获取遗留的历史作业到内存
            const copilotsMap = await feishu.getLegacyCopilotsMap({
              legacyCopilotAppId: env.FEISHU_COPILOT_APP_ID,
              legacyCopilotTableId: source.table_id,
              auroriansMap,
            });

            const dataSource = Object.values(copilotsMap);

            log(`已从 feishu 获取到 ${dataSource.length} 条遗留作业信息`);

            // 2. 上传到 HEAD
            await feishu.batchUploadCopilot({
              uploadTableId: currentCopilotTable.table_id,
              dataSource,
              creatorUserAccessToken: process.env.FEISHU_UPLOAD_USER_AUTH!,
            });
          });
        },
      };
    },
  };
}

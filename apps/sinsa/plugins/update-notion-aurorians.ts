import { join } from 'node:path';
import type { CliPlugin } from '@modern-js/core';
import { NotionService, NotionEnvSchema } from '@sinsa/datasource-generator';

export function updateNotionAurorians(): CliPlugin {
  return {
    setup(api) {
      return {
        commands({ program }) {
          const { appDirectory } = api.useAppContext();

          program.command('update-notion-aurorians').action(async () => {
            const env = NotionEnvSchema.parse(process.env);

            const notion = new NotionService({
              notionToken: env.NOTION_SUBMIT_TOKEN,
              databaseIds: {
                aurorians: env.NOTION_AURORIAN_DATABASE_ID,
              },
            });

            // 头像下载保存地址
            const avatarDownloadDir = join(
              appDirectory,
              'config',
              'public',
              'avatars',
            );

            const { actualAurorianIds } = await notion.submitAurorianDatabase({
              downloadAvatar: {
                baseURL: env.CHINA_AURORIAN_AVATAR_BASE_URL,
                directory: avatarDownloadDir,
              },
            });

            console.log('添加了以下光灵', actualAurorianIds);
          });
        },
      };
    },
  };
}

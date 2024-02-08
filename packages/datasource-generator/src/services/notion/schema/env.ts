import { z } from '@sinsa/schema';

export const NotionSubmitEnvSchema = z.object({
  NOTION_SUBMIT_TOKEN: z.string().describe('皮克勒斯提交小狗'),
  NOTION_AURORIAN_DATABASE_ID: z.string().describe('光灵数据库 ID'),
  CHINA_AURORIAN_AVATAR_BASE_URL: z.string().describe('国服光灵列表接口'),
  CHINA_AURORIAN_LIST_API: z.string().describe('国际服光灵列表接口'),
  GLOBAL_AURORIAN_LIST_API: z.string().describe('国服光灵头像下载 base url'),
});

export const NotionEnvSchema = z.object({
  NOTION_READ_TOKEN: z.string().describe('读取小狗'),
  NOTION_AURORIAN_DATABASE_ID: z.string().describe('光灵数据库 ID'),
});

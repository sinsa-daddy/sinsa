import { z } from '@sinsa/schema';

export const FeishuEnvSchema = z.object({
  FEISHU_APP_ID: z.string(),
  FEISHU_APP_SECRET: z.string(),
  FEISHU_COPILOT_APP_ID: z.string(),
});

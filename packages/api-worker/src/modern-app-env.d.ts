/// <reference types='@modern-js/module-tools/types' />
/// <reference types='@modern-js/plugin-testing/types' />

interface Env {
  FEISHU_UPLOAD_APP_ID: string;
  FEISHU_UPLOAD_APP_SECRET: string;
  FEISHU_COPILOT_HEAD_TABLE_ID: string;
  FEISHU_COPILOT_APP_ID: string;
  BILI_DAILY_CACHE: KVNamespace;
  FEISHU_APP_TOKEN_CACHE: KVNamespace;
  [key: string]: unknown;
}

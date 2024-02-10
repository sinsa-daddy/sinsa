import { NotionEnvSchema, NotionSubmitEnvSchema } from '../src';
import { toSlug } from '../src/services/slug';
import { NotionService } from '@/services/notion/class';
import { FeishuEnvSchema } from '@/services/feishu/schema/env';
import { FeishuService } from '@/services/feishu/class';

describe('aurorians', () => {
  test('slug', () => {
    expect(toSlug('hello Furry')).toBe('hello-furry');
    expect(toSlug('hello Furry')).toBe('hello-furry-1');
    expect(toSlug('hello vice: Furry')).toBe('hello-vice-furry');
    expect(toSlug('hello & vice: Furry &')).toBe('hello-vice-furry-1');
    expect(toSlug('hello Furry')).toBe('hello-furry-2');
    expect(toSlug('BVabcd p=2 t=3')).toBe('bvabcd-p2-t3');
  });
  test.skip('submit from api', async () => {
    const env = NotionSubmitEnvSchema.parse(process.env);
    const notion = new NotionService({
      notionToken: env.NOTION_SUBMIT_TOKEN,
      databaseIds: {
        aurorians: env.NOTION_AURORIAN_DATABASE_ID,
        terms: env.NOTION_TERM_DATABASE_ID,
      },
    });
    await notion.submitAurorianDatabase();
  });

  test.skip('get aurorians', async () => {
    const env = NotionSubmitEnvSchema.parse(process.env);
    const notion = new NotionService({
      notionToken: env.NOTION_SUBMIT_TOKEN,
      databaseIds: {
        aurorians: env.NOTION_AURORIAN_DATABASE_ID,
        terms: env.NOTION_TERM_DATABASE_ID,
      },
    });
    await notion.getAuroriansMap();
  });
});

describe('copilots', () => {
  test.skip(
    'legacy',
    async () => {
      const env = FeishuEnvSchema.and(NotionEnvSchema).parse(process.env);

      const feishu = new FeishuService({
        appId: env.FEISHU_APP_ID,
        appSecret: env.FEISHU_APP_SECRET,
        tableAppIds: {
          copilots: env.FEISHU_COPILOT_APP_ID,
        },
      });

      const result = await feishu.getCopilotsTableMeta();
      console.log('result', result);
    },
    1000 * 60 * 10,
  );

  test.skip(
    'submit legacy',
    async () => {
      const env = FeishuEnvSchema.parse(process.env);

      const feishu = new FeishuService({
        appId: env.FEISHU_APP_ID,
        appSecret: env.FEISHU_APP_SECRET,
        tableAppIds: {
          copilots: env.FEISHU_COPILOT_APP_ID,
        },
      });
      console.log('fetshu', feishu);
      // const data = await import('./legacy.json');
      // await feishu.batchUploadCopilot({
      //   uploadTableId: 'xxx',
      //   dataSource: Object.values(data.default).map(item =>
      //     CopilotNextSchema.parse(item),
      //   ),
      //   creatorUserAccessToken: 'xxx',
      // });
    },
    1000 * 60 * 10,
  );
});

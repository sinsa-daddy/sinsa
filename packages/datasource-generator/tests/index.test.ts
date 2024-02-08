import { join } from 'path';
import {
  DataSourceGenerator,
  NotionEnvSchema,
  NotionSubmitEnvSchema,
} from '../src';
import { toSlug } from '../src/services/slug';
import { NotionService } from '@/services/notion/class';
import { FeishuEnvSchema } from '@/services/feishu/schema/env';
import { FeishuService } from '@/services/feishu/class';

const APP_SECRET = process.env.LARK_SINSA_PUPPY_APP_SECRET;
const LARK_SINSA_PUPPY_APP_ID = 'cli_a5d98466bd7e500e';

const AURORIAN_APP_TOKEN = 'Aucwbe7LIaB1vis5gSCcSLJAnqh';
const AURORIAN_TABLE_ID = 'tblZGEdXTgTvAlwR';

describe.skip('Default cases', () => {
  if (!APP_SECRET) {
    return;
  }
  test('generateDataSource', async () => {
    const dg = new DataSourceGenerator({
      appSecret: APP_SECRET,
      appId: LARK_SINSA_PUPPY_APP_ID,
    });

    await dg.generateCopilot({
      copilotAppToken: 'UDU9bhMetawhSesFVv9cUUNLnZa',
      outputDir: join(__dirname, './output'),
    });

    await dg.generateAurorian({
      aurorianAppToken: AURORIAN_APP_TOKEN,
      aurorianTableId: AURORIAN_TABLE_ID,
      outputDir: join(__dirname, './output'),
    });

    const s = 'hello Modern.js';
    expect(s).toBe('hello Modern.js');
  }, 8000);
});

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
      },
    });
    await notion.getAuroriansMap();
  });
});

describe('copilots', () => {
  test(
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

      const notion = new NotionService({
        notionToken: env.NOTION_READ_TOKEN,
        databaseIds: {
          aurorians: env.NOTION_AURORIAN_DATABASE_ID,
        },
      });

      const result = await feishu.getCopilotsTableMeta();

      const legacyCopilotTableIds = Object.keys(result.copilotsTablesMap);
      if (legacyCopilotTableIds.length) {
        const auroriansMap = await notion.getAuroriansMap();
        const copilotsMap = await feishu.getLegacyCopilotsMap({
          legacyCopilotAppId: env.FEISHU_COPILOT_APP_ID,
          legacyCopilotTableId: legacyCopilotTableIds[0],
          auroriansMap,
        });
        console.log('copilotsMap', copilotsMap);
      }
    },
    1000 * 60 * 10,
  );
});

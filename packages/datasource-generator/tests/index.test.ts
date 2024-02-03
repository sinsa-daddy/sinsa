import { join } from 'path';
import { DataSourceGenerator } from '../src';
import { toSlug } from '../src/services/slug';
import { NotionService } from '@/services/notion/class';

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
  if (
    !(
      process.env.NOTION_SUBMIT_TOKEN && process.env.NOTION_AURORIAN_DATABASE_ID
    )
  ) {
    console.log(
      '请确保环境变量中包含 NOTION_SUBMIT_TOKEN、NOTION_AURORIAN_DATABASE_ID',
    );
    return;
  }
  const notion = new NotionService({
    notionToken: process.env.NOTION_SUBMIT_TOKEN,
    databaseIds: {
      aurorians: process.env.NOTION_AURORIAN_DATABASE_ID,
    },
  });
  test('slug', () => {
    expect(toSlug('hello Furry')).toBe('hello-furry');
    expect(toSlug('hello Furry')).toBe('hello-furry-1');
    expect(toSlug('hello vice: Furry')).toBe('hello-vice-furry');
    expect(toSlug('hello & vice: Furry &')).toBe('hello-vice-furry-1');
    expect(toSlug('hello Furry')).toBe('hello-furry-2');
  });
  test('submit from api', async () => {
    await notion.submitAurorianDatabase();
  });
});

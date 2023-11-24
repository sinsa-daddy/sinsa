import { join } from 'path';
import { DataSourceGenerator } from '../src';

const APP_SECRET = process.env.LARK_SINSA_PUPPY_APP_SECRET;
const LARK_SINSA_PUPPY_APP_ID = 'cli_a5d98466bd7e500e';

const AURORIAN_APP_TOKEN = 'Aucwbe7LIaB1vis5gSCcSLJAnqh';
const AURORIAN_TABLE_ID = 'tblZGEdXTgTvAlwR';

describe('Default cases', () => {
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
      k: 5,
    });

    await dg.generateAurorian({
      aurorianAppToken: AURORIAN_APP_TOKEN,
      aurorianTableId: AURORIAN_TABLE_ID,
      outputDir: join(__dirname, './output'),
    });

    const s = 'hello Modern.js';
    expect(s).toBe('hello Modern.js');
  });
});

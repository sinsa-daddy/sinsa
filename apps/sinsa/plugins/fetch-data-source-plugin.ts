import { join } from 'path';
import type { CliPlugin } from '@modern-js/core';
import { DataSourceGenerator } from '@sinsa/datasource-generator';
import { remove } from 'fs-extra';

const LARK_SINSA_PUPPY_APP_ID = 'cli_a5d98466bd7e500e';
// eslint-disable-next-line prefer-destructuring
const LARK_SINSA_PUPPY_APP_SECRET = process.env.LARK_SINSA_PUPPY_APP_SECRET;

const COPILOT_APP_TOKEN = 'UDU9bhMetawhSesFVv9cUUNLnZa';
const AURORIAN_APP_TOKEN = 'Aucwbe7LIaB1vis5gSCcSLJAnqh';
const AURORIAN_TABLE_ID = 'tblZGEdXTgTvAlwR';

export function fetchDataSourcePlugin(): CliPlugin {
  return {
    setup(api) {
      return {
        commands({ program }) {
          program.command('fetch').action(async () => {
            if (!LARK_SINSA_PUPPY_APP_SECRET) {
              console.log('Cannot find LARK_SINSA_PUPPY_APP_SECRET');
              return;
            }

            const context = api.useAppContext();
            const OUTPUT_DIR = join(
              context.appDirectory,
              './config/public/api',
            );

            console.log(`Clean the dir ${OUTPUT_DIR}`);
            await remove(OUTPUT_DIR);

            const dg = new DataSourceGenerator({
              appId: LARK_SINSA_PUPPY_APP_ID,
              appSecret: LARK_SINSA_PUPPY_APP_SECRET,
            });

            await dg.generateAurorian({
              aurorianAppToken: AURORIAN_APP_TOKEN,
              aurorianTableId: AURORIAN_TABLE_ID,
              outputDir: OUTPUT_DIR,
            });
            console.log('Aurorians are generated');

            await dg.generateCopilot({
              copilotAppToken: COPILOT_APP_TOKEN,
              outputDir: OUTPUT_DIR,
            });
            console.log('Copilots are genreated.');
          });
        },
      };
    },
  };
}

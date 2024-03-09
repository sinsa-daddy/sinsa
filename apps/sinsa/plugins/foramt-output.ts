import { join } from 'path';
import type { CliPlugin } from '@modern-js/core';
import { remove, copy } from 'fs-extra';

const USELESS_JSON = [
  'modern.config.json',
  'nestedRoutes.json',
  'route.json',
  'routes-manifest.json',
  'public',
] as const;

export function formatOutputPlugin(): CliPlugin {
  return {
    setup(api) {
      return {
        commands({ program }) {
          const { distDirectory } = api.useAppContext();
          program.command('format-output').action(async () => {
            // 1. remove useless .json
            await Promise.all([
              ...USELESS_JSON.map(jsonFilename =>
                remove(join(distDirectory, jsonFilename)),
              ),
              remove(join(distDirectory, 'api', 'v2', 'copilots', 'archived')),
            ]);

            // 2. add functions
            await Promise.all([
              copy(
                require.resolve('@sinsa/api-worker/dist/es/index.js'),
                join(
                  distDirectory,
                  'functions',
                  'api-worker',
                  '[[catchAll]].js',
                ),
              ),
              copy(
                require.resolve('@sinsa/service-worker/dist/es/index.js'),
                join(distDirectory, 'sw.js'),
              ),
            ]);
          });
        },
      };
    },
  };
}

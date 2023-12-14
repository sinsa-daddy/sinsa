import { join } from 'path';
import type { CliPlugin } from '@modern-js/core';
import { remove } from 'fs-extra';

const USELESS_JSON = [
  'modern.config.json',
  'nestedRoutes.json',
  'route.json',
  'routes-manifest.json',
] as const;

export function formatOutputPlugin(): CliPlugin {
  return {
    setup(api) {
      return {
        commands({ program }) {
          const { distDirectory } = api.useAppContext();
          program.command('format-output').action(async () => {
            // 1. remove useless .json
            await Promise.all(
              USELESS_JSON.map(jsonFilename =>
                remove(join(distDirectory, jsonFilename)),
              ),
            );
          });
        },
      };
    },
  };
}

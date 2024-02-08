import { CliPlugin } from '@modern-js/core';

export function updateFeishuCopilots(): CliPlugin {
  return {
    setup() {
      return {
        commands({ program }) {
          program.command('update-feishu-copilots').action(async () => {
            const env = Feishusch;
          });
        },
      };
    },
  };
}

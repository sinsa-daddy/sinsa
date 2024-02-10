import { useRequest } from 'ahooks';
import type { CopilotNextType } from '@sinsa/schema';
import { toFeishuCopilot } from '@sinsa/schema';
import { postCopilot } from '@/services/http';

export function usePostCopilot() {
  const { loading: loadingPostCopilot, runAsync: postCopilotAsync } =
    useRequest(
      async (submitCopilot: CopilotNextType) => {
        const remoteCopilot = toFeishuCopilot(submitCopilot);
        const result = await postCopilot(remoteCopilot);

        return result;
      },
      { manual: true },
    );

  return {
    loadingPostCopilot,
    postCopilotAsync,
  };
}

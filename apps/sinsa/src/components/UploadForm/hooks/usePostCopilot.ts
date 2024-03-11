import { useRequest } from 'ahooks';
import type { CopilotNextType } from '@sinsa/schema';
import { toFeishuCopilotWithoutCreatedInfo } from '@sinsa/schema';
import { postCopilot } from '@/services/http';

export function usePostCopilot() {
  const { loading: loadingPostCopilot, runAsync: postCopilotAsync } =
    useRequest(
      async (
        submitCopilot: Omit<CopilotNextType, 'created_time' | 'created_by'>,
        { triggerAction }: { triggerAction?: boolean },
      ) => {
        const remoteCopilot = toFeishuCopilotWithoutCreatedInfo(submitCopilot);
        const result = await postCopilot(remoteCopilot, { triggerAction });

        return result;
      },
      { manual: true },
    );

  return {
    loadingPostCopilot,
    postCopilotAsync,
  };
}

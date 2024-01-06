import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import type { CopilotType } from '@sinsa/schema';
import { toInputRemoteCopilot } from '../utils/toInputRemoteCopilot';
import { postCopilot } from '@/services/http';
import { AuroriansModel } from '@/models/aurorians';
import { TermsModel } from '@/models/terms';

export function usePostCopilot() {
  const [{ auroriansMap }] = useModel(AuroriansModel);
  const [{ termsMap }] = useModel(TermsModel);

  const { loading: loadingPostCopilot, runAsync: postCopilotAsync } =
    useRequest(
      async (submitCopilot: CopilotType) => {
        const remoteCopilot = toInputRemoteCopilot(submitCopilot, {
          termsMap,
          auroriansMap,
        });
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

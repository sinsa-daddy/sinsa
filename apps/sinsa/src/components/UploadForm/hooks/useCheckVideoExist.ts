import { useRequest } from 'ahooks';
import type { getCopilotId } from '../utils/get-copilot-id';
import { checkVideoExist } from '@/services/http';

export function useCheckVideoExist() {
  const { loading: loadingCheckVideoExist, runAsync: check } = useRequest(
    async (args: Parameters<typeof getCopilotId>[0]) => {
      return checkVideoExist(args);
    },
    {
      manual: true,
    },
  );

  return {
    loadingCheckVideoExist,
    check,
  };
}

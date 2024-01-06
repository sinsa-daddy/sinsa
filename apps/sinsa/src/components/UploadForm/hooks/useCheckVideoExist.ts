import { useRequest } from 'ahooks';
import { checkVideoExist } from '@/services/http';

export function useCheckVideoExist() {
  const { loading: loadingCheckVideoExist, runAsync: check } = useRequest(
    async ({ bv, term }: { bv: string; term: string | number }) => {
      return checkVideoExist({ bv, term });
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

import { useRequest } from 'ahooks';
import { checkVideoExist } from '@/services/http';

export function useCheckVideoExist() {
  const { loading: loadingCheckVideoExist, runAsync: check } = useRequest(
    async ({ href, termId }: { href: string; termId: string }) => {
      return checkVideoExist({ href, termId });
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

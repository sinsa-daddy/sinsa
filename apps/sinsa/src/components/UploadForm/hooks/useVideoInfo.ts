import { useRequest } from 'ahooks';
import { getVideoInfo } from '@/services/http';

export function useVideoInfo() {
  const { data, loading, runAsync, mutate } = useRequest(
    async bv => {
      const result = await getVideoInfo(bv);

      return result;
    },
    { manual: true },
  );

  return {
    videoInfo: data,
    loadingVideoInfo: loading,
    getVideoInfo: runAsync,
    setVideoInfo: mutate,
  };
}

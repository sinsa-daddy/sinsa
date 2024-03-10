import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import { SearchVideoResultSchema } from './schemas/SearchVideo';
import { SimpleLatestCopilotsResultSchema } from './schemas/SimpleLatestCopilot';
import { getLatestCopilots, getLatestVideo } from '@/services/http';

export function useLatestVideo() {
  const {
    loading: loadingLatestVideos,
    runAsync: getLatestVideosAsync,
    data: latestVideos,
    refresh: refreshLatestVideos,
  } = useRequest(
    async () => {
      try {
        const data = await getLatestVideo();

        return SearchVideoResultSchema.parse(data);
      } catch (error) {
        console.log('parse error', error);
      }
      return undefined;
    },
    {
      manual: true,
    },
  );

  const {
    data: latestCopilots,
    loading: loadingLatestCopilots,
    runAsync: getLatestCopilotsAsync,
    refresh: refreshLatestCopilots,
  } = useRequest(
    async () => {
      try {
        const data = await getLatestCopilots({ pageSize: 30 });
        return SimpleLatestCopilotsResultSchema.parse(data);
      } catch (error) {
        console.log('parse error', error);
      }
      return undefined;
    },
    { manual: true },
  );

  const refresh = useCallback(() => {
    refreshLatestCopilots();
    refreshLatestVideos();
  }, []);

  return {
    latestVideos,
    loadingLatestVideos,
    getLatestVideosAsync,
    latestCopilots,
    loadingLatestCopilots,
    getLatestCopilotsAsync,
    refresh,
  };
}

import { useLocalStorageState } from 'ahooks';
import { useMemo } from 'react';
import type { TermNextType } from '@sinsa/schema';
import type { QueryParamsType } from '../../schemas/query-params';

interface UseInitialValuesArgs {
  termId: TermNextType['term_id'];
}

const LOCAL_STORAGE_SETTING_KEY_PREFIX = 'SINSA_DADDY_SOLUTIONS_FILTER_KEY_V1';

const DEFAULT_INITIAL_VALUES: QueryParamsType = {
  k: 3,
  exclude: [{}] as any[],
};

export function useInitialValues({ termId }: UseInitialValuesArgs) {
  const LOCAL_STORAGE_SETTING_KEY = useMemo(
    () => `${LOCAL_STORAGE_SETTING_KEY_PREFIX}_${termId}` as const,
    [termId],
  );

  const [loaclInitialValues, setLocalInitialValues] =
    useLocalStorageState<QueryParamsType>(LOCAL_STORAGE_SETTING_KEY, {
      defaultValue: undefined,
    });

  return {
    initialValues: loaclInitialValues ?? DEFAULT_INITIAL_VALUES,
    setLocalInitialValues,
  };
}

import { useLocalStorageState } from 'ahooks';
import { useMemo } from 'react';
import type { QueryParamsType } from '../../schemas/query-params';

interface UseInitialValuesArgs {
  term: number;
}

const LOCAL_STORAGE_SETTING_KEY_PREFIX = 'SINSA_DADDY_SOLUTIONS_FILTER_KEY_V1';

const DEFAULT_INITIAL_VALUES: QueryParamsType = {
  k: 3,
  exclude: [{}] as any[],
};

export function useInitialValues({ term }: UseInitialValuesArgs) {
  const LOCAL_STORAGE_SETTING_KEY = useMemo(
    () => `${LOCAL_STORAGE_SETTING_KEY_PREFIX}_${term}` as const,
    [term],
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

import type { QueryParamsType } from '../schemas/query-params';

export function ensureQueryKey(key: keyof QueryParamsType) {
  return key;
}

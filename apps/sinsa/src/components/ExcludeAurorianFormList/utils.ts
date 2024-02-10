import type { ExcludeDataType } from '@/views/SolutionView/schemas/query-params';

export function ensureExcludeKey(key: keyof ExcludeDataType) {
  return key;
}

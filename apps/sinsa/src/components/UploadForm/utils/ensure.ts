import type { FormValues } from '../types';

export function ensureKey(key: keyof FormValues) {
  return key;
}

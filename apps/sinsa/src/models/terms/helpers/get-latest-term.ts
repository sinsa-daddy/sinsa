import type { TermNextType } from '@sinsa/schema';
import { minBy } from 'lodash-es';

const NOW = Date.now();

/**
 * 这期荒典是否正在进行中
 * @param term
 */
export function isRunning(term: TermNextType) {
  return term.start_time.valueOf() < NOW && NOW < term.end_time.valueOf();
}

/**
 * 获取最近的期数
 * @param terms
 * @returns
 */
export function getLatestTerm(terms: TermNextType[]) {
  // 1. 是否有进行中的
  const runningTerm = terms.find(t => isRunning(t));
  if (runningTerm) {
    return runningTerm;
  }

  // 2. 找刚刚结束的
  const endLatest = minBy(terms, t => Math.abs(t.end_time.valueOf() - NOW));

  if (endLatest) {
    return endLatest;
  }

  return undefined;
}

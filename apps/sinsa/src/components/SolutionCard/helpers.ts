import { memoize } from 'lodash-es';

export const getSolutionTitle = memoize((k?: number): string => {
  switch (k) {
    case 1:
      return '一队方案';
    case 2:
      return '两队方案';
    case 3:
      return '三队方案';
    case 4:
      return '四队方案';
    default:
      return '匹配方案';
  }
});

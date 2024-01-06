import type { Rule } from 'antd/es/form';

export const AURORIAN_SUMMARIES_RULES: Rule[] = [
  {
    async validator(_, array) {
      if (Array.isArray(array) && array.length === 5) {
        // pass
      } else {
        throw new Error('光灵阵容搭配不正确');
      }
    },
  },
  { required: true },
];

export const SCORE_RULES: Rule[] = [
  { required: true },
  {
    async validator(_, value) {
      if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
        // pass
      } else {
        throw new Error('分数必须是正整数');
      }

      if (value >= 1e8) {
        throw new Error('分数大于一亿分了，你要不再看看有没有填对？');
      } else if (value <= 1e5) {
        throw new Error('分数小于十万分，你要不要再看看有没有填对？');
      }
    },
  },
];

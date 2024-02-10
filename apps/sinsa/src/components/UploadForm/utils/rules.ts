import type { Rule } from 'antd/es/form';

export const AURORIAN_SUMMARIES_RULES: Rule[] = [
  {
    async validator(_, array) {
      if (Array.isArray(array) && array.length === 5) {
        // pass
      } else {
        throw new Error('光灵数量必须满足 5 个');
      }
    },
  },
  { required: true },
];

export const SCORE_RULES: Rule[] = [
  { required: true },
  {
    async validator(_, value) {
      if (typeof value === 'number' && value.toString().endsWith('0000')) {
        throw new Error(
          '不能填写粗略分数, 荒典作业分数必须精确到个位, 请拖动视频进度条到最后查看具体分数',
        );
      }
    },
  },
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

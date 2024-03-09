import type { TermNextType } from '@sinsa/schema';
import { Typography, type AlertProps } from 'antd';

export const COMMON_ALERT_PROPS: AlertProps = {
  type: 'error',
  showIcon: false,
  banner: true,
};

export const ALERT_MAP = new Map<TermNextType['term_id'], AlertProps>([
  [
    'cn-26',
    {
      message:
        '光灵黑潮目前装备技能存在 Bug 使得荒典分数可能存在虚高问题。官方将于 1 月 10 日更新后修复。本期黑潮队伍分数仅供参考。',
      action: (
        <Typography.Link
          href={`https://www.bilibili.com/read/cv29262782/`}
          target="_blank"
        >
          查看官方公告
        </Typography.Link>
      ),
    },
  ],
  [
    'cn-35',
    {
      type: 'info',
      message:
        '温馨提示：为了避免下周全勤启迪四级效果增加格子概率导致可能乱轴，保险起见建议在周末打完荒典。',
    },
  ],
]);
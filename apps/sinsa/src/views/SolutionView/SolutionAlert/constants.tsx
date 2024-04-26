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
    'cn-42',
    {
      message:
        '光灵安西娅目前装备技能存在 Bug 使得她配合森龙露科亚伤害爆炸。后续官方可能会修复。本期安西娅队伍分数仅供参考，没抄的同学赶紧抄作业',
    },
  ],
  // [
  //   'cn-36',
  //   {
  //     message:
  //       '3月20日版本更新后, 本期荒典首领恶面花在部分情况下存在猛毒层数减少异常问题，导致抄作业失败，所以可能不是练度不够而是游戏有 bug, 请等待官方修复',
  //   },
  // ],
]);

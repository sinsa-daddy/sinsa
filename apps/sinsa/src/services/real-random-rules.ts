import type { CopilotNextType } from '@sinsa/schema';

export interface RealRandomMessage {
  level: 'error';
  reason: string;
}

export type RealRandomRule = (
  c: CopilotNextType,
) => RealRandomMessage | undefined;

export const REAL_RANDOM_RULES: RealRandomRule[] = [
  // 莱莎一破深色格真随机
  function RyzaOneBk(c) {
    const ryza = c.aurorian_requirements.find(a => a.aurorian_id === 'ryza');

    if (typeof ryza?.breakthrough === 'number' && ryza.breakthrough >= 3) {
      return {
        level: 'error',
        reason: '光灵莱莎一破深色格效果',
      };
    }
  },
];

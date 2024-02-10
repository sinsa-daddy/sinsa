import { AurorianAttributeType, AurorianClassType } from '@sinsa/schema';
import E1 from '@/assets/elements/1.webp';
import E2 from '@/assets/elements/2.webp';
import E3 from '@/assets/elements/3.webp';
import E4 from '@/assets/elements/4.webp';
import C1 from '@/assets/classes/2001.webp';
import C2 from '@/assets/classes/2002.webp';
import C3 from '@/assets/classes/2003.webp';
import C4 from '@/assets/classes/2004.webp';

export const ElementURLMapper = {
  [AurorianAttributeType.Water]: E1,
  [AurorianAttributeType.Fire]: E2,
  [AurorianAttributeType.Forest]: E3,
  [AurorianAttributeType.Thunder]: E4,
};

export const ElementTextMapper = {
  [AurorianAttributeType.Water]: '水',
  [AurorianAttributeType.Fire]: '火',
  [AurorianAttributeType.Forest]: '森',
  [AurorianAttributeType.Thunder]: '雷',
};

export const ClassURLMapper = {
  [AurorianClassType.Converter]: C1,
  [AurorianClassType.Sniper]: C2,
  [AurorianClassType.Detonator]: C3,
  [AurorianClassType.Supporter]: C4,
};

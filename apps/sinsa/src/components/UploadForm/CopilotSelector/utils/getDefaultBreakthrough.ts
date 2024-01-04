import { AurorianRarityType } from '@sinsa/schema';
import { memoize } from 'lodash-es';

export const getDefaultBreakthrough = memoize((rarity: AurorianRarityType) => {
  switch (rarity) {
    case AurorianRarityType.Star6:
      return 2;
    case AurorianRarityType.Star5:
      return 1;
    case AurorianRarityType.Star4:
      return 4;
    case AurorianRarityType.Star3:
      return 3;
    case AurorianRarityType.Star2:
      return 2;
    case AurorianRarityType.Star1:
      return 1;
    default:
      return 0;
  }
});

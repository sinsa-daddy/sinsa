import { AurorianRarityType } from '@sinsa/schema';
import { memoize } from 'lodash-es';

export const getDefaultTooltips = memoize((rarity: AurorianRarityType) => {
  switch (rarity) {
    case AurorianRarityType.Star6:
      return ['零', '零', '一', '一', '一', '满'].map(txt => `${txt}破`);
    case AurorianRarityType.Star5:
      return ['零', '一', '一', '一', '满'].map(txt => `${txt}破`);
    case AurorianRarityType.Star4:
      return ['零', '零', '零', '满'].map(txt => `${txt}破`);
    case AurorianRarityType.Star3:
      return ['零', '零', '满'].map(txt => `${txt}破`);
    case AurorianRarityType.Star2:
      return ['零', '满'].map(txt => `${txt}破`);
    case AurorianRarityType.Star1:
      return ['满'].map(txt => `${txt}破`);
    default:
      return [];
  }
});

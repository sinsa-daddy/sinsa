import { memoize } from 'lodash-es';

export const getDefaultTooltips = memoize((rarity: number) => {
  switch (rarity) {
    case 6:
      return ['零', '零', '一', '一', '一', '满'].map(txt => `${txt}破`);
    case 5:
      return ['零', '一', '一', '一', '满'].map(txt => `${txt}破`);
    case 4:
      return ['零', '零', '零', '满'].map(txt => `${txt}破`);
    case 3:
      return ['零', '零', '满'].map(txt => `${txt}破`);
    case 2:
      return ['零', '满'].map(txt => `${txt}破`);
    case 1:
      return ['满'].map(txt => `${txt}破`);
    default:
      return [];
  }
});

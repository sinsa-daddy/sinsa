import { memoize } from 'lodash-es';

export const getDefaultBreakthrough = memoize((rarity: number) => {
  switch (rarity) {
    case 6:
      return 2;
    case 5:
      return 5;
    case 4:
      return 4;
    case 3:
      return 3;
    case 2:
      return 2;
    case 1:
      return 1;
    default:
      return 0;
  }
});

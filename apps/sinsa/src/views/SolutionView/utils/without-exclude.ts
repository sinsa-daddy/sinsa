import { produce } from 'immer';
import type { AurorianRequirementType } from '@sinsa/schema';
import type { QueryParamsType } from '../schemas/query-params';

export function getNormalizeBreakthroughByRarity(
  currentBreakthrough: number,
  rarity: 1 | 2 | 3 | 4 | 5 | 6 | number,
) {
  switch (rarity) {
    case 6:
      return [0, 0, 3, 3, 3, 6].at(currentBreakthrough - 1)!;
    case 5:
      return [0, 2, 2, 2, 5].at(currentBreakthrough - 1)!;
    case 4:
      return [0, 0, 0, 4].at(currentBreakthrough - 1)!;
    case 3:
      return [0, 0, 3].at(currentBreakthrough - 1)!;
    case 2:
      return [0, 2].at(currentBreakthrough - 1)!;
    case 1:
      return [1].at(currentBreakthrough - 1)!;
    default:
      return 0;
  }
}

export function withoutExclude(
  summaries: Record<
    AurorianRequirementType['aurorian_id'],
    AurorianRequirementType
  >,
  exclude: QueryParamsType['exclude'],
) {
  if (!exclude) {
    return summaries;
  }
  return produce(summaries, draft => {
    for (const {
      excludeBreakthroughOnly,
      excludeBreakthrough,
      aurorianId,
    } of exclude) {
      // 如果是仅仅排除突破
      if (excludeBreakthroughOnly) {
        // 如果排除突破的要求 >= 1
        if (
          typeof excludeBreakthrough === 'number' &&
          excludeBreakthrough >= 1
        ) {
          // const targetAurorian = auroriansMap[aurorianName];
          // 那么说明 Box 里的该光灵的突破一定比排除突破小 1
          draft[aurorianId].breakthrough = Math.max(excludeBreakthrough - 1, 0);
        }
      } else {
        // 否则排除该光灵
        delete draft[aurorianId];
      }
    }
  });
}

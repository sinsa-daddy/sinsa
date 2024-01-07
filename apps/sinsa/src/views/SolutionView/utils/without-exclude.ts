import type { AurorianType, MyBoxType } from '@sinsa/schema';
import { AurorianRarityType } from '@sinsa/schema';
import { produce } from 'immer';
import type { QueryParamsType } from '../schemas/query-params';

function getNormalizeBreakthroughByRarity(
  currentBreakthrough: number,
  rarity: AurorianRarityType,
) {
  switch (rarity) {
    case AurorianRarityType.Star6:
      return [0, 0, 3, 3, 3, 6].at(currentBreakthrough - 1)!;
    case AurorianRarityType.Star5:
      return [0, 1, 1, 1, 5].at(currentBreakthrough - 1)!;
    case AurorianRarityType.Star4:
      return [0, 0, 0, 4].at(currentBreakthrough - 1)!;
    case AurorianRarityType.Star3:
      return [0, 0, 3].at(currentBreakthrough - 1)!;
    case AurorianRarityType.Star2:
      return [0, 2].at(currentBreakthrough - 1)!;
    case AurorianRarityType.Star1:
      return [1].at(currentBreakthrough - 1)!;
    default:
      return 0;
  }
}

export function withoutExclude(
  summaries: MyBoxType['aurorian_summaries'],
  exclude: QueryParamsType['exclude'],
  auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>,
) {
  if (!exclude) {
    return summaries;
  }
  return produce(summaries, draft => {
    for (const {
      excludeBreakthroughOnly,
      excludeBreakthrough,
      aurorianName,
    } of exclude) {
      // 如果是仅仅排除突破
      if (excludeBreakthroughOnly) {
        // 如果排除突破的要求 >= 1
        if (
          typeof excludeBreakthrough === 'number' &&
          excludeBreakthrough >= 1
        ) {
          const targetAurorian = auroriansMap[aurorianName];
          // 那么说明 Box 里的该光灵的突破一定比排除突破小 1
          draft[aurorianName].breakthrough = Math.max(
            getNormalizeBreakthroughByRarity(
              excludeBreakthrough,
              targetAurorian.rarity,
            ) - 1,
            0,
          );
        }
      } else {
        // 否则排除该光灵
        delete draft[aurorianName];
      }
    }
  });
}

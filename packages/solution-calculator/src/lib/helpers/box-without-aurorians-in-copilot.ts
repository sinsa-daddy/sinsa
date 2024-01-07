import type { CopilotType, MyBoxType } from '@sinsa/schema';
import type { CalcOptions } from '../../types';

export function boxWithoutAuroriansInCopilot(
  myBox: MyBoxType['aurorian_summaries'],
  copilot: CopilotType,
  { disableAlternative: disalbeAlternative }: CalcOptions,
): MyBoxType['aurorian_summaries'] {
  const cloneMyBox = { ...myBox };
  for (const aurorianInCopilot of copilot.aurorian_summaries) {
    // 0. 如果作业中的光灵本身是可替换的，则跳过此光灵判断
    if (!disalbeAlternative && aurorianInCopilot.is_replaceable) {
      continue;
    }

    delete cloneMyBox[aurorianInCopilot.aurorian_name];
  }
  return cloneMyBox;
}

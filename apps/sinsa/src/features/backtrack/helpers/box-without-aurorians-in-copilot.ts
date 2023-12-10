import type { CopilotType, MyBoxType } from '@sinsa/schema';
import { produce } from 'immer';

export function boxWithoutAuroriansInCopilot(
  myBox: MyBoxType['aurorian_summaries'],
  copilot: CopilotType,
  {
    disalbeAlternative,
  }: {
    /**
     * 是否禁止可替换位置
     */
    disalbeAlternative?: boolean;
  },
) {
  return produce(myBox, draft => {
    for (const aurorianInCopilot of copilot.aurorian_summaries) {
      // 0. 如果作业中的光灵本身是可替换的，则跳过此光灵判断
      if (!disalbeAlternative && aurorianInCopilot.is_replaceable) {
        continue;
      }

      delete draft[aurorianInCopilot.aurorian_name];
    }
  });
}

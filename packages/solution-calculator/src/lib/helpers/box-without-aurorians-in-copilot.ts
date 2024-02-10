import type { CopilotNextType, AurorianRequirementType } from '@sinsa/schema';
import type { CalcOptions } from '../../types';

export function boxWithoutAuroriansInCopilot(
  myBox: Record<
    AurorianRequirementType['aurorian_id'],
    AurorianRequirementType
  >,
  copilot: CopilotNextType,
  { disableAlternative: disalbeAlternative }: CalcOptions,
): Record<AurorianRequirementType['aurorian_id'], AurorianRequirementType> {
  const cloneMyBox = { ...myBox };
  for (const aurorianRequirement of copilot.aurorian_requirements) {
    // 0. 如果作业中的光灵本身是可替换的，则跳过此光灵判断
    if (
      !disalbeAlternative &&
      aurorianRequirement.remark?.replace?.type === 'any' &&
      aurorianRequirement.remark.replace.any === 'All'
    ) {
      continue;
    }

    delete cloneMyBox[aurorianRequirement.aurorian_id];
  }
  return cloneMyBox;
}

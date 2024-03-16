import type { CopilotNextType, AurorianRequirementType } from '@sinsa/schema';
import type { CalcOptions } from '../../types';

/**
 * 我的 Box 能否抄这个作业
 * @param copilot 作业
 * @param myBox 我的 Box
 * @returns 我的 Box 能否抄这个作业
 */
export function canUseCopilot(
  myBox: Record<
    AurorianRequirementType['aurorian_id'],
    AurorianRequirementType
  >,
  copilot: CopilotNextType,
  { disableAlternative, copilotsIgnore }: CalcOptions,
): boolean {
  // 0. 一开始就排除特定作业
  if (
    Array.isArray(copilotsIgnore) &&
    copilotsIgnore.length > 0 &&
    copilotsIgnore.includes(copilot.copilot_id)
  ) {
    return false;
  }

  for (const aurorianRequirement of copilot.aurorian_requirements) {
    // 1. 如果作业中的光灵本身是可替换的，则跳过此光灵判断
    if (
      !disableAlternative &&
      aurorianRequirement.remark?.replace?.type === 'any'
    ) {
      continue;
    }

    const aurorianInMyBox = myBox[aurorianRequirement.aurorian_id] as
      | AurorianRequirementType
      | undefined;

    // 2. 光灵本身不存在于我的 box
    if (!aurorianInMyBox) {
      return false;
    }

    // 3. 如果我的 box 光灵突破低于作业要求突破
    if (aurorianInMyBox.breakthrough < aurorianRequirement.breakthrough) {
      return false;
    }
  }

  return true;
}

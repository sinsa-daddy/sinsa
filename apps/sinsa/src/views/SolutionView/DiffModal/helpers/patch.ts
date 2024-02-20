import type { AurorianRequirementType } from '@sinsa/schema';
import { produce } from 'immer';
import type { CopilotDiffType } from '../../schemas/query-params';

export function patchAurorianRequirements(
  origin: [
    AurorianRequirementType,
    AurorianRequirementType,
    AurorianRequirementType,
    AurorianRequirementType,
    AurorianRequirementType,
  ],
  diff: CopilotDiffType['auroriansReplace'],
): [
  AurorianRequirementType,
  AurorianRequirementType,
  AurorianRequirementType,
  AurorianRequirementType,
  AurorianRequirementType,
] {
  if (!diff) {
    return origin;
  }

  return produce(origin, draft => {
    for (const oneDiff of diff) {
      const target = draft.find(t => t.aurorian_id === oneDiff.origin);
      if (target) {
        target.aurorian_id = oneDiff.alter.aurorianId;
        target.breakthrough = oneDiff.alter.breakthrough;
        delete target.remark;
      }
    }
  });
}

import type { AurorianRequirementRemarkType } from '@sinsa/schema';

export function normalizeRemark(remark?: AurorianRequirementRemarkType) {
  if (remark && Object.keys(remark).length === 0) {
    return undefined;
  }
  return remark;
}

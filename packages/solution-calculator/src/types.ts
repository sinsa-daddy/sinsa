import type { AurorianRequirementType, CopilotNextType } from '@sinsa/schema';

export interface SolutionContext {
  copilots: CopilotNextType[];
  availableBox: Record<
    AurorianRequirementType['aurorian_id'],
    AurorianRequirementType
  >;
}

export interface Solution {
  copilots: CopilotNextType[];
  totalScore: number;
}

export interface AllSolutions {
  solutions: Solution[];
}

export interface CalcOptions {
  /**
   * 是否禁止可替换位置
   */
  disableAlternative?: boolean;

  /**
   * 是否忽略掉特定作业
   */
  copilotsIgnore?: CopilotNextType['copilot_id'][];
}

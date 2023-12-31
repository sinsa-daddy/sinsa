import type { CopilotType, MyBoxType } from '@sinsa/schema';

export interface SolutionContext {
  copilots: CopilotType[];
  availableBox: MyBoxType['aurorian_summaries'];
}

export interface Solution {
  copilots: CopilotType[];
  totalScore: number;
}

export interface AllSolutions {
  solutions: Solution[];
}

export interface CalcOptions {
  /**
   * 是否禁止可替换位置
   */
  disalbeAlternative?: boolean;

  /**
   * 是否忽略掉特定作业
   */
  copilotsIgnore?: CopilotType['bv'][];
}

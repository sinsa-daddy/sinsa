import type { CopilotType, MyBoxType } from '@sinsa/schema';

export interface SolutionContext {
  copilots: CopilotType[];
  availableBox: MyBoxType['aurorian_summaries'];
}

export interface SolutionScenario {
  copilots: CopilotType[];
  totalScore: bigint;
}

export interface SolutionResult {
  scenarios: SolutionScenario[];
}

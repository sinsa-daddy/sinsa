import type { CopilotAurorianSummaryType } from '@sinsa/schema';

export interface FormValues {
  term: number;
  rerun_terms?: number[];
  bv: `BV${string}`;
  duplicate: boolean;
  title: string;
  description: string;
  author: string;
  upload_time: number;
  score: number;
  aurorian_summaries: [
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
  ];
}

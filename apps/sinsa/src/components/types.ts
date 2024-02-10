import type { AurorianNextType, CopilotNextType } from '@sinsa/schema';

export type IgnoreMessage =
  | {
      type: 'aurorian';
      aurorianId: AurorianNextType['aurorian_id'];
      breakthrough?: number;
    }
  | {
      type: 'copilot';
      copilotId: CopilotNextType['copilot_id'];
    };

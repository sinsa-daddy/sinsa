import type { AurorianType } from '@sinsa/schema';

export type IgnoreMessage =
  | {
      type: 'aurorian';
      aurorianName: AurorianType['aurorian_name'];
      breakthrough?: number;
    }
  | {
      type: 'copilot';
      bv: string;
    };

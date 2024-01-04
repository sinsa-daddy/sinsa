import type { AurorianType } from '@sinsa/schema';

export interface IgnoreMessage {
  aurorianName: AurorianType['aurorian_name'];
  breakthrough?: number;
}

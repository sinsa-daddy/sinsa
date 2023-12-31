import { z } from 'zod';
import { AurorianAttributeType } from './aurorian';

export const TermSchema = z.object({
  term: z.coerce.number().int().describe('荒典期数'),
  boss_name: z.string(),
  boss_attribute: z.nativeEnum(AurorianAttributeType).describe('BOSS属性'),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  features: z.string(),
  _record_id: z.string(),
});

export type TermType = z.infer<typeof TermSchema>;

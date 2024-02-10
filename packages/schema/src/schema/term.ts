import { z } from 'zod';
import { AurorianAttributeType } from './aurorian';

const TERM_ID_REGEXP = /^cn-\d+$/;

export const TermNextSchema = z.object({
  term_id: z.string().regex(TERM_ID_REGEXP),
  order: z.coerce.number().int().describe('荒典期数'),
  boss_name: z.string(),
  boss_element: z.nativeEnum(AurorianAttributeType).describe('BOSS属性'),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  features: z.string(),
  reruns: z.optional(z.array(z.string().regex(TERM_ID_REGEXP))),
});

export interface TermNextType extends z.infer<typeof TermNextSchema> {}

import { z } from 'zod';
import { AurorianAttributeType } from '@sinsa/schema';
import {
  NotionIntSchema,
  NotionTextSchema,
  NotionTimeRangeSchema,
  NotionTitleSchema,
} from './common';

export const InputNotionTermSchema = z.object({
  term: NotionIntSchema,
  boss_name: NotionTitleSchema,
  boss_attribute: z.object({
    type: z.literal('select'),
    select: z.object({
      name: z.nativeEnum(AurorianAttributeType),
    }),
  }),
  period: NotionTimeRangeSchema,
  features: NotionTextSchema,
});

export type InputNotionTermType = z.infer<typeof InputNotionTermSchema>;

export const NotionTermSchema = z.object({
  id: z.string(),
  properties: InputNotionTermSchema,
});

export type NotionTermType = z.infer<typeof NotionTermSchema>;

// export function toTermType(n: NotionTermType): TermType {
//   return {
//     term: n.properties.term.number,
//     boss_name
//   };
// }

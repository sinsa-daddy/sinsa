import { z } from 'zod';
import { AurorianSummarySchema } from './my-box';

export enum AssetType {
  No33Scripts = 'No33Scripts',
}

export const RemoteCopilotSchema = z.object({
  bv: z.string().startsWith('BV'),
  title: z.string(),
  description: z.optional(z.string()),
  author: z.string(),
  insert_db_time: z.optional(z.coerce.date()),
  upload_time: z.coerce.date(),
  score: z.coerce.number(),
  term: z.tuple([
    z.object({
      text_arr: z.array(z.string()),
    }),
  ]),
  rerun_terms: z.tuple([
    z.object({
      text_arr: z.array(z.string()),
    }),
  ]),

  replaceable_position: z.optional(z.string().array()),
  aurorian_1: z.tuple([
    z.object({
      text: z.string(),
    }),
  ]),
  aurorian_1_breakthrough: z.coerce.number().min(0).max(6),

  aurorian_2: z.tuple([
    z.object({
      text: z.string(),
    }),
  ]),
  aurorian_2_breakthrough: z.coerce.number().min(0).max(6),

  aurorian_3: z.tuple([
    z.object({
      text: z.string(),
    }),
  ]),
  aurorian_3_breakthrough: z.coerce.number().min(0).max(6),

  aurorian_4: z.tuple([
    z.object({
      text: z.string(),
    }),
  ]),
  aurorian_4_breakthrough: z.coerce.number().min(0).max(6),

  aurorian_5: z.tuple([
    z.object({
      text: z.string(),
    }),
  ]),
  aurorian_5_breakthrough: z.coerce.number().min(0).max(6),
  asset_type: z.optional(z.nativeEnum(AssetType)),
  asset_link: z.optional(z.string().startsWith('https://')),
});

export type RemoteCopilotType = z.infer<typeof RemoteCopilotSchema>;

export const CopilotAurorianSummarySchema = AurorianSummarySchema.extend({
  is_replaceable: z.boolean(),
});

export type CopilotAurorianSummaryType = z.infer<
  typeof CopilotAurorianSummarySchema
>;

export const CopilotSchema = z.object({
  bv: z.string().startsWith('BV'),
  title: z.string(),
  description: z.optional(z.string()),
  author: z.string(),
  insert_db_time: z.optional(z.coerce.date()),
  upload_time: z.coerce.date(),
  score: z.coerce.number(),
  term: z.coerce.number().int(),
  rerun_terms: z.optional(z.array(z.coerce.number().int())),
  aurorian_summaries: z.tuple([
    CopilotAurorianSummarySchema,
    CopilotAurorianSummarySchema,
    CopilotAurorianSummarySchema,
    CopilotAurorianSummarySchema,
    CopilotAurorianSummarySchema,
  ]),
  asset_type: z.optional(z.nativeEnum(AssetType)),
  asset_link: z.optional(z.string().startsWith('https://')),
});

export type CopilotType = z.infer<typeof CopilotSchema>;

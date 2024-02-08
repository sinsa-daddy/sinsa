import { z } from '@sinsa/schema';
import { FeishuSingleReferenceTextSchema } from './feishu-fields';

export const LegacyEnNameMapper: Record<string, string | undefined> = {
  'Vice Keen Sight': 'Vice: Keen Sight',
};

export const FeishuLegacyCopilotItemFieldSchema = z.object({
  asset_link: z.optional(z.string().startsWith('https://')),
  asset_type: z.optional(z.enum(['No33Scripts'])),
  aurorian_1: FeishuSingleReferenceTextSchema,
  aurorian_1_breakthrough: z.coerce.number().min(0).max(6),
  aurorian_2: FeishuSingleReferenceTextSchema,
  aurorian_2_breakthrough: z.coerce.number().min(0).max(6),
  aurorian_3: FeishuSingleReferenceTextSchema,
  aurorian_3_breakthrough: z.coerce.number().min(0).max(6),
  aurorian_4: FeishuSingleReferenceTextSchema,
  aurorian_4_breakthrough: z.coerce.number().min(0).max(6),
  aurorian_5: FeishuSingleReferenceTextSchema,
  aurorian_5_breakthrough: z.coerce.number().min(0).max(6),
  author: z.string(),
  bv: z.string(),
  description: z.optional(z.string()),
  replaceable_position: z.optional(z.array(z.string())),
  score: z.coerce.number(),
  term: FeishuSingleReferenceTextSchema,
  title: z.string(),
  upload_time: z.coerce.date(),
});

export const FeishuLegacyCopilotItemSchema = z.object({
  fields: FeishuLegacyCopilotItemFieldSchema,
  id: z.string().startsWith('rec'),
  record_id: z.string().startsWith('rec'),
  created_by: z.object({
    id: z.string().startsWith('ou_'),
    name: z.string(),
  }),
  created_time: z.coerce.date(),
  last_modified_by: z.object({
    id: z.string().startsWith('ou_'),
    name: z.string(),
  }),
  last_modified_time: z.coerce.date(),
});

export interface FeishuLegacyCopilotItemType
  extends z.infer<typeof FeishuLegacyCopilotItemSchema> {}

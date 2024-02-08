import { z } from '@sinsa/schema';

export const FeishuSingleReferenceTextSchema = z.tuple([
  z.object({
    record_ids: z.tuple([z.string().startsWith('rec')]),
    table_id: z.string().startsWith('tbl'),
    text: z.string(),
    text_arr: z.tuple([z.string()]),
    type: z.literal('text'),
  }),
]);

export interface FeishuSingleReferenceTextType
  extends z.infer<typeof FeishuSingleReferenceTextSchema> {}

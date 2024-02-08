import { z } from '@sinsa/schema';

export const FeishuTableMetaSchema = z.object({
  name: z.string(),
  revision: z.number(),
  table_id: z.string().startsWith('tbl'),
});

export interface FeishuTableMetaType
  extends z.infer<typeof FeishuTableMetaSchema> {}

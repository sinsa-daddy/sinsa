import { z } from 'zod';

export const TableSummarySchema = z.object({
  name: z.string(),
  revision: z.number(),
  table_id: z.string().startsWith('tbl'),
});

export type TableSummaryType = z.infer<typeof TableSummarySchema>;

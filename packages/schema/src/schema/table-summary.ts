import { z } from 'zod';

export const TableSummaryBaseSchema = z.object({
  name: z.string(),
  revision: z.number(),
  table_id: z.string().startsWith('tbl'),
});

export type TableSummaryBaseType = z.infer<typeof TableSummaryBaseSchema>;

export const TableSummarySchema = TableSummaryBaseSchema.extend({
  term: z.number(),
});

export type TableSummaryType = z.infer<typeof TableSummarySchema>;

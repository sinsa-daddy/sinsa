import { z } from '@sinsa/schema';

export const SimpleLatestCopilotSchema = z.object({
  insert_db_time: z.coerce.date(),
  creator: z.object({
    name: z.string(),
  }),
  bv: z.string(),
  score: z.coerce.number(),
});

export type SimpleLatestCopilotType = z.infer<typeof SimpleLatestCopilotSchema>;

export const SimpleLatestCopilotsResultSchema = z.array(
  SimpleLatestCopilotSchema,
);

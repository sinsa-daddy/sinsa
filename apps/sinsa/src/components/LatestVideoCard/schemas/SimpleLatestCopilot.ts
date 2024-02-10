import { CopilotNextUserSchema, z } from '@sinsa/schema';

export const SimpleLatestCopilotSchema = z.object({
  created_time: z.coerce.date(),
  created_by: z.preprocess(
    val => (typeof val === 'string' ? JSON.parse(val) : val),
    CopilotNextUserSchema,
  ),
  copilot_id: z.string(),
  score: z.coerce.number(),
  term_id: z.string(),
  href: z.string(),
});

export interface SimpleLatestCopilotType
  extends z.infer<typeof SimpleLatestCopilotSchema> {}

export const SimpleLatestCopilotsResultSchema = z.array(
  SimpleLatestCopilotSchema,
);

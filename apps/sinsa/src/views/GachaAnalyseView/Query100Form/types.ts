import { z } from '@sinsa/schema';

export const Query100FormValuesSchema = z.object({
  href: z.string(),
  code: z.string(),
});

export interface Query100FormValuesType
  extends z.infer<typeof Query100FormValuesSchema> {}

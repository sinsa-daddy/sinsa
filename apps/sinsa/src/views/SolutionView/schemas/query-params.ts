import { z } from 'zod';

export const ExcludeDataSchema = z.object({
  aurorianName: z.string(),
  excludeBreakthroughOnly: z.optional(z.boolean()),
  excludeBreakthrough: z.optional(z.boolean()),
});

export const QueryParamsSchema = z.object({
  k: z.number().min(1).max(4),
  disableAlternative: z.optional(z.boolean()),
  enableExclude: z.optional(z.boolean()),
  exclude: z.optional(z.array(ExcludeDataSchema)),
  enableSaveLocalStorage: z.optional(z.boolean()),
  copilotsIgnore: z.optional(z.array(z.string())),
});

export type QueryParamsType = z.infer<typeof QueryParamsSchema>;
export type ExcludeDataType = z.infer<typeof ExcludeDataSchema>;

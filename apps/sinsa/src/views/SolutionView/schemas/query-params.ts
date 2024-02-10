import { z } from '@sinsa/schema';

export const ExcludeDataSchema = z.object({
  aurorianId: z.string(),
  excludeBreakthroughOnly: z.optional(z.boolean()),
  excludeBreakthrough: z.optional(z.number()),
});

export const QueryParamsSchema = z.object({
  k: z.number().min(1).max(4),
  disableAlternative: z.optional(z.boolean()),
  enableExclude: z.optional(z.boolean()),
  exclude: z.optional(z.array(ExcludeDataSchema)),
  enableSaveLocalStorage: z.optional(z.boolean()),
  copilotsIgnore: z.optional(z.array(z.string())),
});

export interface QueryParamsType extends z.infer<typeof QueryParamsSchema> {}

export interface ExcludeDataType extends z.infer<typeof ExcludeDataSchema> {}

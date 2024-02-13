import { z } from '@sinsa/schema';

export const ExcludeDataSchema = z.object({
  aurorianId: z.string(),
  excludeBreakthroughOnly: z.optional(z.boolean()),
  excludeBreakthrough: z.optional(z.number()),
});

export const CopilotDiffAuroriansReplaceSchema = z.object({
  origin: z.string(),
  alter: z.object({
    aurorianId: z.string(),
    breakthrough: z.number(),
  }),
});

export const CopilotDiffSchema = z.object({
  copilotId: z.string().describe('作用的作业ID'),
  diffScore: z.optional(z.number()).describe('分数差值'),
  auroriansReplace: z.optional(z.array(CopilotDiffAuroriansReplaceSchema)),
});

export const QueryParamsSchema = z.object({
  k: z.number().min(1).max(4),
  disableAlternative: z.optional(z.boolean()),
  enableExclude: z.optional(z.boolean()),
  exclude: z.optional(z.array(ExcludeDataSchema)),
  enableSaveLocalStorage: z.optional(z.boolean()),
  copilotsIgnore: z.optional(z.array(z.string())),
  copilotsDiff: z.optional(z.array(CopilotDiffSchema)),
});

export interface QueryParamsType extends z.infer<typeof QueryParamsSchema> {}

export interface ExcludeDataType extends z.infer<typeof ExcludeDataSchema> {}

export interface CopilotDiffType extends z.infer<typeof CopilotDiffSchema> {}

export interface CopilotDiffAuroriansReplaceType
  extends z.infer<typeof CopilotDiffAuroriansReplaceSchema> {}

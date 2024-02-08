import { z } from 'zod';

export const AurorianRequirementLevelSchema = z.object({
  asc: z.number().min(0).max(3),
  lv: z.number().min(1).max(80),
  eq: z.number().min(0).max(10).describe('装备等级, 0 = 无要求'),
  rfn: z.number().min(0).max(3).describe('精炼等级, 0 = 无要求'),
  aff: z.number().min(0).max(10).describe('好感等级, 0 = 无要求'),
});

export interface AurorianRequirementLevelType
  extends z.infer<typeof AurorianRequirementLevelSchema> {}

export const AurorianRequirementReplaceSchema = z
  .object({
    type: z.literal('Aurorians'),
    aurorians: z.array(z.string()),
  })
  .or(
    z.object({
      type: z.literal('Any'),
      any: z.enum(['All', 'DPS']),
    }),
  );

export type AurorianRequirementReplaceType = z.infer<
  typeof AurorianRequirementReplaceSchema
>;

export const AurorianRequirementSchema = z.object({
  aurorian_id: z.string(),
  breakthrough: z.number().min(0).max(6).describe('光灵突破数（黄色星星数量）'),
  level: z
    .optional(AurorianRequirementLevelSchema)
    .describe('觉醒、等级、装备技能、精炼、好感'),
  replace: z.optional(AurorianRequirementReplaceSchema).describe('可替换对象'),
});

export interface AurorianRequirementType
  extends z.infer<typeof AurorianRequirementSchema> {}

export const CopilotNextSchema = z.object({
  copilot_id: z.string().describe('作业唯一标识'),
  source_type: z.enum(['Bili', 'Ytb']),
  href: z.string().describe('BVxxx?p=x 或者 watch?v=xxx'),
  term_id: z.string().describe('期数唯一标识'),
  title: z.string(),
  score: z.number(),
  author: z.object({
    author_id: z.literal('$UNKNOWN').or(z.string()).describe('作者唯一标识'),
    name: z.string(),
  }),
  description: z.optional(z.string()),
  upload_time: z.coerce.date(),
  insert_db_time: z.optional(z.coerce.date()),
  creator: z.object({
    creator_id: z.string().describe('录入人唯一标识'),
    type: z.enum(['feishu']),
    name: z.string().describe('录入人名称'),
  }),
  aurorian_requirements: z.tuple([
    AurorianRequirementSchema,
    AurorianRequirementSchema,
    AurorianRequirementSchema,
    AurorianRequirementSchema,
    AurorianRequirementSchema,
  ]),
  asset: z.optional(
    z.object({
      type: z.enum(['No33Scripts']),
      link: z.string().startsWith('https://'),
    }),
  ),
});

export interface CopilotNextType extends z.infer<typeof CopilotNextSchema> {}

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
    type: z.literal('aurorians'),
    aurorians: z.array(z.string()),
  })
  .or(
    z.object({
      type: z.literal('any'),
      any: z.enum(['All', 'DPS']),
    }),
  );

export type AurorianRequirementReplaceType = z.infer<
  typeof AurorianRequirementReplaceSchema
>;

export const AurorianRequirementRemarkSchema = z.object({
  level: z
    .optional(AurorianRequirementLevelSchema)
    .describe('觉醒、等级、装备技能、精炼、好感'),
  replace: z.optional(AurorianRequirementReplaceSchema).describe('可替换对象'),
});

export const AurorianRequirementSchema = z.object({
  aurorian_id: z.string(),
  breakthrough: z.number().min(0).max(6).describe('光灵突破数（黄色星星数量）'),
  remark: z.optional(AurorianRequirementRemarkSchema),
});

export interface AurorianRequirementType
  extends z.infer<typeof AurorianRequirementSchema> {}

export const UNKNOWN_AUTHOR_ID = '$UNKNOWN$' as const;

export enum CopilotSourceType {
  Bilibili = 'Bilibili',
  Youtube = 'Youtube',
}

export enum CopilotUserProviderType {
  Feishu = 'Feishu',
}

export const CopilotNextAuthorSchema = z.object({
  author_id: z
    .literal(UNKNOWN_AUTHOR_ID)
    .or(z.string())
    .describe('作者唯一标识'),
  name: z.string(),
});

export const CopilotNextUserSchema = z.object({
  user_id: z.string(),
  provider_type: z.nativeEnum(CopilotUserProviderType),
  name: z.string(),
});

export const CopilotNextAssetSchema = z.object({
  type: z.literal('script33'),
  script33: z.object({
    link: z.string().startsWith('https://'),
  }),
});

export const CopilotNextSchema = z.object({
  copilot_id: z.string().describe('作业唯一标识'),
  source_type: z.nativeEnum(CopilotSourceType),
  href: z.string().describe('BVxxx?p=x 或者 watch?v=xxx'),
  term_id: z.string().describe('期数唯一标识'),
  title: z.string(),
  score: z.number(),
  author: CopilotNextAuthorSchema,
  description: z.optional(z.string()),
  upload_time: z.coerce.date(),
  created_by: CopilotNextUserSchema,
  created_time: z.coerce.date(),
  last_modified_by: CopilotNextUserSchema,
  last_modified_time: z.coerce.date(),
  aurorian_requirements: z.tuple([
    AurorianRequirementSchema,
    AurorianRequirementSchema,
    AurorianRequirementSchema,
    AurorianRequirementSchema,
    AurorianRequirementSchema,
  ]),
  assets: z.optional(z.array(CopilotNextAssetSchema)),
});

export interface CopilotNextType extends z.infer<typeof CopilotNextSchema> {}

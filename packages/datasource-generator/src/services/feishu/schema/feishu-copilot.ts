import {
  AurorianRequirementRemarkSchema,
  CopilotNextAssetSchema,
  CopilotNextUserSchema,
  CopilotSourceType,
  UNKNOWN_AUTHOR_ID,
  z,
} from '@sinsa/schema';

export const FeishuCopilotSchema = z.object({
  copilot_id: z.string(),
  source_type: z.nativeEnum(CopilotSourceType),
  href: z.string(),
  term_id: z.string(),
  title: z.string(),
  score: z.number(),
  author_id: z.string().or(z.literal(UNKNOWN_AUTHOR_ID)),
  author_name: z.string(),
  description: z.optional(z.string()),
  upload_time: z.date().transform(val => val.valueOf()),
  created_by: CopilotNextUserSchema.transform(user => JSON.stringify(user)),
  created_time: z.date().transform(val => val.valueOf()),
  aurorian_1_id: z.string(),
  aurorian_1_breakthrough: z.number(),
  aurorian_1_remark: z.optional(
    AurorianRequirementRemarkSchema.transform(remark => JSON.stringify(remark)),
  ),
  aurorian_2_id: z.string(),
  aurorian_2_breakthrough: z.number(),
  aurorian_2_remark: z.optional(
    AurorianRequirementRemarkSchema.transform(remark => JSON.stringify(remark)),
  ),
  aurorian_3_id: z.string(),
  aurorian_3_breakthrough: z.number(),
  aurorian_3_remark: z.optional(
    AurorianRequirementRemarkSchema.transform(remark => JSON.stringify(remark)),
  ),
  aurorian_4_id: z.string(),
  aurorian_4_breakthrough: z.number(),
  aurorian_4_remark: z.optional(
    AurorianRequirementRemarkSchema.transform(remark => JSON.stringify(remark)),
  ),
  aurorian_5_id: z.string(),
  aurorian_5_breakthrough: z.number(),
  aurorian_5_remark: z.optional(
    AurorianRequirementRemarkSchema.transform(remark => JSON.stringify(remark)),
  ),
  assets: z.optional(
    z.array(CopilotNextAssetSchema).transform(asset => JSON.stringify(asset)),
  ),
});

export interface FeishuCopilotType
  extends z.infer<typeof FeishuCopilotSchema> {}

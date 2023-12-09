import { z } from 'zod';

/**
 * Box 中简单光灵 Zod Schema
 */
export const AurorianSummarySchema = z.object({
  aurorian_name: z.string().describe('光灵英文名，以此作为唯一标识'),
  breakthrough: z.number().min(0).max(6).describe('光灵突破数（黄色星星数量）'),
});

export type AurorianSummaryType = z.infer<typeof AurorianSummarySchema>;

/**
 * 我的 Box Zod Schema
 */
export const MyBoxSchema = z.object({
  title: z.string().describe('给该 Box 取一个名字'),
  create_time: z.coerce.date().describe('此 Box 创建时间'),
  version: z.literal(1).describe('该 Schema 版本'),
  aurorian_summaries: z.record(AurorianSummarySchema).describe('拥有的光灵'),
});

export type MyBoxType = z.infer<typeof MyBoxSchema>;

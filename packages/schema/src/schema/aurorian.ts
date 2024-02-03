import { z } from 'zod';

/**
 * 光灵属性
 */
export enum AurorianAttributeType {
  /**
   * 森属性 🍃
   */
  Forest = 'Forest',

  /**
   * 水属性 💧
   */
  Water = 'Water',

  /**
   * 火属性 🔥
   */
  Fire = 'Fire',

  /**
   * 雷属性 ⚡️
   */
  Thunder = 'Thunder',
}

/**
 * 光灵职业类型
 */
export enum AurorianClassType {
  /**
   * 爆破 💥
   */
  Detonator = 'Detonator',

  /**
   * 狙击 🎯
   */
  Sniper = 'Sniper',

  /**
   * 转色 🔄
   */
  Converter = 'Converter',

  /**
   * 辅助 🆘
   */
  Supporter = 'Supporter',
}

/**
 * 光灵稀有度（星级）
 */
export enum AurorianRarityType {
  Star6 = '6', // ⭐⭐⭐⭐⭐⭐
  Star5 = '5', // ⭐⭐⭐⭐⭐
  Star4 = '4', // ⭐⭐⭐⭐
  Star3 = '3', // ⭐⭐⭐
  Star2 = '2', // ⭐⭐
  Star1 = '1', // ⭐
}

/**
 * 光灵 Zod Schema
 */
export const AurorianSchema = z.object({
  aurorian_name: z.string().describe('光灵英文名，以此作为唯一标识'),
  aurorian_cn_name: z.string().describe('光灵简体中文名'),
  attribute: z.nativeEnum(AurorianAttributeType).describe('光灵属性'),
  secondary_attribute: z
    .optional(z.nativeEnum(AurorianAttributeType))
    .describe('光灵副属性'),
  class: z.nativeEnum(AurorianClassType).describe('光灵职业类型'),
  rarity: z.nativeEnum(AurorianRarityType).describe('光灵稀有度（星级）'),
  server: z
    .enum(['cn', 'global'])
    .array()
    .describe('光灵所在服务器（国服、国际服）'),
  _record_id: z.string().startsWith('rec'),
});

/**
 * 光灵类型
 */
export interface AurorianType extends z.infer<typeof AurorianSchema> {}

export const AurorianNextSchema = z.object({
  aurorian_id: z.string(),
  name: z.string(),
  cn_name: z.string(),
  primary_element: z.nativeEnum(AurorianAttributeType),
  secondary_element: z.optional(z.nativeEnum(AurorianAttributeType)),
  profession: z.nativeEnum(AurorianClassType),
  rarity: z.number().min(1).max(6),
});

export interface AurorianNextType extends z.infer<typeof AurorianNextSchema> {}

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

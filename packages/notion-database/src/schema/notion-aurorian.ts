import { z } from 'zod';
import {
  AurorianAttributeType,
  AurorianClassType,
  AurorianRarityType,
} from '@sinsa/schema';
import { NotionTextSchema, NotionTitleSchema } from './common';

export const InputNotionAurorianSchema = z.object({
  aurorian_name: NotionTitleSchema,
  aurorian_cn_name: NotionTextSchema,
  attribute: z.object({
    type: z.literal('select'),
    select: z.object({
      name: z.nativeEnum(AurorianAttributeType),
    }),
  }),
  secondary_attribute: z.object({
    type: z.literal('select'),
    select: z.nullable(
      z.object({
        name: z.nativeEnum(AurorianAttributeType),
      }),
    ),
  }),
  class: z.object({
    type: z.literal('select'),
    select: z.nullable(
      z.object({
        name: z.nativeEnum(AurorianClassType),
      }),
    ),
  }),
  rarity: z.object({
    type: z.literal('select'),
    select: z.nullable(
      z.object({
        name: z.nativeEnum(AurorianRarityType),
      }),
    ),
  }),
});

export type InputNotionAurorianType = z.infer<typeof InputNotionAurorianSchema>;

export const NotionAurorianSchema = z.object({
  id: z.string(),
  properties: InputNotionAurorianSchema,
});

export type NotionAurorianType = z.infer<typeof NotionAurorianSchema>;

import { z } from '@sinsa/schema';

export const SimpleAurorian = z.object({
  gameId: z.string(),
  name: z.string(),
  rarity: z.number().min(1).max(6),
  element: z.number(),
  element2: z.number(),
  profession: z.number(),
  baseThumbnail: z.string().endsWith('.webp'),
});

export interface SimpleAurorianType extends z.infer<typeof SimpleAurorian> {}

export const SimpleAurorianList = z.array(SimpleAurorian);

export interface SimpleAurorianListType
  extends z.infer<typeof SimpleAurorianList> {}

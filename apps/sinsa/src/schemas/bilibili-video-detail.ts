import { z } from '@sinsa/schema';

export const BilibiliVideoDetailSchema = z.object({
  bvid: z.string().startsWith('BV'),
  aid: z.number(),
  pic: z.string(),
  pubdate: z.coerce.date(),
  duration: z.number(),
  desc: z.string(),
  owner: z.object({
    name: z.string(),
  }),
  title: z.string(),
});

export type BilibiliVideoDetailType = z.infer<typeof BilibiliVideoDetailSchema>;

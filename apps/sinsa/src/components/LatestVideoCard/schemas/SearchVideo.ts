import { z } from 'zod';

export const SearchVideoSchema = z.object({
  type: z.literal('video'),
  author: z.string(),
  pic: z.string(),
  bvid: z.string().startsWith('BV'),
  title: z.string(),
  pubdate: z.number().transform(v => v * 1000),
  hit_columns: z.array(z.enum(['title', 'tag', 'author', 'description'])),
});

export type SearchVideoType = z.infer<typeof SearchVideoSchema>;

export const SearchVideoResultSchema = z.object({
  seid: z.string(),
  page: z.number(),
  pagesize: z.number(),
  numResults: z.number(),
  numPages: z.number(),
  result: z.array(SearchVideoSchema),
});

export type SearchVideoResultType = z.infer<typeof SearchVideoResultSchema>;

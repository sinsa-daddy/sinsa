import { z } from 'zod';
import { ISO_DATETIME_REGEX } from '@/constants';

export const NotionTitleSchema = z.object({
  type: z.literal('title'),
  title: z.tuple([
    z.object({
      type: z.literal('text'),
      text: z.object({
        content: z.string(),
      }),
    }),
  ]),
});

export const NotionIntSchema = z.object({
  type: z.literal('number'),
  number: z.number().int(),
});

export const NotionTextSchema = z.object({
  type: z.literal('rich_text'),
  rich_text: z.tuple([
    z.object({
      type: z.literal('text'),
      text: z.object({
        content: z.string(),
      }),
    }),
  ]),
});

export const NotionTimeRangeSchema = z.object({
  type: z.literal('date'),
  date: z.object({
    start: z.string().regex(ISO_DATETIME_REGEX),
    end: z.string().regex(ISO_DATETIME_REGEX),
  }),
});

export const NotionTimeSchema = z.object({
  type: z.literal('date'),
  date: z.object({
    start: z.string().regex(ISO_DATETIME_REGEX),
    end: z.null(),
  }),
});

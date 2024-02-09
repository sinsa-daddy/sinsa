import { z } from '@sinsa/schema';

export const FeishuProfileSchema = z.object({
  avatar_url: z.string(),
  en_name: z.string(),
  name: z.string(),
  open_id: z.string(),
  tenant_key: z.string(),
  union_id: z.string(),
});

export type FeishuProfileType = z.infer<typeof FeishuProfileSchema>;

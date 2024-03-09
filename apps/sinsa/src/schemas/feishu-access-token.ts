import { z } from '@sinsa/schema';

// const a = {
//   access_token: 'u-4ArQf_ljZ5lQ02e9b',
//   refresh_token: 'ur-4Y5.YoG0g4Q02b9b',
//   token_type: 'Bearer',
//   expires_in: 7200,
//   refresh_expires_in: 2592000,
//   scope: 'auth:user.id:read bitable:app',
// };

export const FeishuAccessTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_expires_in: z.number(),
  scope: z.string(),
  startTime: z.number(),
});

export interface FeishuAccessTokenType
  extends z.infer<typeof FeishuAccessTokenSchema> {}

import { z } from 'zod';

export const AuthorizationHeaderSchema = z.object({
  authorization: z.string().startsWith('Bearer u-'),
});

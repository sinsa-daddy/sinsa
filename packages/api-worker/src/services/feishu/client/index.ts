import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

let client: Client | null = null;

const AppAccessTokenResultSchema = z.object({
  code: z.number(),
  msg: z.string(),
  app_access_token: z.string(),
  expire: z.number(),
  start: z.number(),
});

export class Client {
  private _appId: string;

  private _appSecret: string;

  constructor(options: { appId: string; appSecret: string }) {
    this._appId = options.appId;
    this._appSecret = options.appSecret;
  }

  async getAndSaveAppAccessToken(ctx: Context) {
    const now = Date.now();
    const env = ctx.env as Env;
    const parsed = AppAccessTokenResultSchema.safeParse(
      await env.FEISHU_APP_TOKEN_CACHE.get(`appid-${env.FEISHU_UPLOAD_APP_ID}`),
    );

    if (
      parsed.success &&
      parsed.data.app_access_token &&
      now < parsed.data.expire * 1000 + parsed.data.start
    ) {
      return parsed.data.app_access_token;
    }

    const response = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          app_id: this._appId,
          app_secret: this._appSecret,
        }),
      },
    );
    try {
      const result = AppAccessTokenResultSchema.parse({
        ...((await response.json()) ?? {}),
        start: now,
      });

      await env.FEISHU_APP_TOKEN_CACHE.put(
        `appid-${env.FEISHU_UPLOAD_APP_ID}`,
        JSON.stringify(result),
        { expirationTtl: result.expire },
      );

      return result.app_access_token;
    } catch (error) {
      throw new HTTPException(500, {
        message: error instanceof Error ? error.message : 'failed to parse.',
      });
    }
  }
}

export function getOrCreateClient(c: Context): Client {
  const env = c.env as Env;
  if (client) {
    return client;
  }

  const newOne = new Client({
    appId: env.FEISHU_UPLOAD_APP_ID,
    appSecret: env.FEISHU_UPLOAD_APP_SECRET,
  });
  client = newOne;
  return client;
}

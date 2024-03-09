import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

let client: Client | null = null;

const AppAccessTokenResultSchema = z.object({
  code: z.number(),
  msg: z.string(),
  app_access_token: z.string(),
  expire: z.number(),
});

export class Client {
  private _appId: string;

  private _appSecret: string;

  private _lastRequestAppAccessTokenExpiredTime: number | undefined;

  private _appAccessToken: string | undefined;

  constructor(options: { appId: string; appSecret: string }) {
    this._appId = options.appId;
    this._appSecret = options.appSecret;
  }

  async getAndSaveAppAccessToken() {
    const now = Date.now();
    if (
      this._appAccessToken &&
      typeof this._lastRequestAppAccessTokenExpiredTime === 'number' &&
      now > this._lastRequestAppAccessTokenExpiredTime
    ) {
      return this._appAccessToken;
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

    const parsed = AppAccessTokenResultSchema.safeParse(await response.json());
    if (parsed.success && parsed.data.code === 0) {
      this._appAccessToken = parsed.data.app_access_token;
      this._lastRequestAppAccessTokenExpiredTime =
        now + parsed.data.expire * 1000;
      return parsed.data.app_access_token;
    } else {
      throw new HTTPException(500, { res: response });
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

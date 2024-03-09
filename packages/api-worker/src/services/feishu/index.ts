import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { get, mapValues, pick } from 'lodash-es';
import { z } from 'zod';
import { getOrCreateClient } from './client';
import { FeishuResponse } from './types';

const feishu = new Hono();

/**
 * 获取飞书授权
 */
feishu.post(
  '/access-token',
  zValidator(
    'json',
    z.object({
      code: z.string(),
    }),
  ),
  async ctx => {
    const body = ctx.req.valid('json');

    const client = getOrCreateClient(ctx);

    const response = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: body.code,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await client.getAndSaveAppAccessToken()}`,
        },
      },
    );

    const responseJson = await response.json<FeishuResponse>();
    return ctx.json(responseJson, responseJson.code !== 0 ? 500 : 200);
  },
);

/**
 * 刷新飞书授权 token
 */
feishu.post(
  '/refresh-token',
  zValidator(
    'json',
    z.object({
      refresh_token: z.string(),
    }),
  ),
  async ctx => {
    const body = ctx.req.valid('json');

    const client = getOrCreateClient(ctx);

    const response = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/oidc/refresh_access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: body.refresh_token,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await client.getAndSaveAppAccessToken()}`,
        },
      },
    );

    const responseJson = await response.json<FeishuResponse>();
    return ctx.json(responseJson, responseJson.code !== 0 ? 500 : 200);
  },
);

const AuthorizationHeaderSchema = z.object({
  authorization: z.string().startsWith('Bearer u-'),
});

/**
 * 获取登录用户信息
 * @docs https://open.feishu.cn/document/server-docs/authentication-management/login-state-management/get
 */
feishu.get(
  '/profile',
  zValidator('header', AuthorizationHeaderSchema),
  async ctx => {
    const header = ctx.req.valid('header');
    const response = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/user_info',
      {
        headers: {
          Authorization: header.authorization,
        },
      },
    );

    const responseJson = await response.json<FeishuResponse>();
    return ctx.json(responseJson, responseJson.code !== 0 ? 500 : 200);
  },
);

feishu.get(
  '/latest-copilots',
  zValidator('header', AuthorizationHeaderSchema),
  zValidator(
    'query',
    z.object({
      pageSize: z.coerce.number(),
    }),
  ),
  async ctx => {
    const header = ctx.req.valid('header');
    const query = ctx.req.valid('query');
    const env = ctx.env as Env;

    const params = new URLSearchParams();
    params.append('page_size', `${query.pageSize}`);

    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${
        env.FEISHU_COPILOT_APP_ID
      }/tables/${
        env.FEISHU_COPILOT_HEAD_TABLE_ID
      }/records/search?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          Authorization: header.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sort: [
            {
              desc: true,
              field_name: 'created_time',
            },
          ],
        }),
      },
    );

    const responseJson = await response.json<FeishuResponse>();

    const formattedData = get(responseJson.data, ['items'], []);

    if (Array.isArray(formattedData)) {
      return ctx.json({
        ...responseJson,
        data: formattedData
          .map(item => {
            const fields = get(item, 'fields');
            if (fields) {
              const values = pick(fields, [
                'created_time',
                'created_by',
                'copilot_id',
                'term_id',
                'href',
                'score',
              ]);
              return mapValues(values, val => {
                if (Array.isArray(val) && get(val, [0, 'type']) === 'text') {
                  return get(val, [0, 'text']);
                }
                return val;
              });
            }
            return undefined;
          })
          .filter(Boolean),
      });
    }
    return ctx.json(
      {
        ...responseJson,
        data: [],
      },
      500,
    );
  },
);

export default feishu;

import { Hono, Context } from 'hono';
import { pick, get } from 'lodash-es';
import { HTTPException } from 'hono/http-exception';
import { getProfile } from '../feishu/helpers/get-profile';
import { PICK_ARRAY, USER_AGENT } from './constants';
import { BilibiliResponse } from './types';
import { getHomeCookie } from './helpers/get-home-cookie';
import { getWBIKeys } from './helpers/get-wbi-keys';
import { encodeWbi } from './helpers/encode-wbi';

const bilibili = new Hono();

declare module 'hono' {
  interface ContextVariableMap {
    open_id: string;
  }
}

function unauthorizedResponse(opts: {
  ctx: Context;
  error: string;
  errDescription: string;
  statusText?: string;
}) {
  return new Response('Unauthorized', {
    status: 401,
    statusText: opts.statusText,
  });
}

bilibili.use(async (ctx, next) => {
  const credentials = ctx.req.header('authorization');
  let token;
  if (credentials) {
    const parts = credentials.split(/\s+/);
    if (parts.length !== 2) {
      throw new HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: 'invalid_request',
          errDescription: 'invalid credentials structure',
        }),
      });
    } else {
      token = parts[1];
    }
  }

  if (!token) {
    throw new HTTPException(401, {
      res: unauthorizedResponse({
        ctx,
        error: 'invalid_request',
        errDescription: 'no authorization included in request',
      }),
    });
  }

  const profile = await getProfile(`Bearer ${token}`);

  if (!profile.data?.open_id) {
    throw new HTTPException(401, {
      res: unauthorizedResponse({
        ctx,
        error: 'invalid_request',
        errDescription: 'no authorization open_id',
      }),
    });
  }

  ctx.set('open_id', profile.data.open_id);
  await next();
});

bilibili.get('/video/:bvid', async ctx => {
  const params = ctx.req.param();

  const query = new URLSearchParams([['bvid', params.bvid]]);

  const response = await fetch(
    `https://api.bilibili.com/x/web-interface/view?${query.toString()}`,
    {
      headers: {
        'User-Agent': USER_AGENT,
      },
    },
  );

  const responseJson = await response.json<BilibiliResponse>();

  if (responseJson.code === 0 && responseJson.data) {
    return ctx.json({
      ...responseJson,
      data: pick(responseJson.data, PICK_ARRAY),
    });
  }
  return ctx.json(
    {
      ...responseJson,
      data: {},
    },
    500,
  );
});

bilibili.get('/latest-videos', async ctx => {
  // const openId = ctx.get('open_id');
  const homeCookie = await getHomeCookie();
  console.log('homeCookie', homeCookie);
  const keys = await getWBIKeys();
  console.log('getWBIKeys', keys);

  if (Array.isArray(homeCookie) && homeCookie.length && keys) {
    const queryString = encodeWbi(
      {
        keyword: '荒典',
        search_type: 'video',
        order: 'pubdate',
      },
      keys.imgKey,
      keys.subKey,
    );

    const response = await fetch(
      `https://api.bilibili.com/x/web-interface/wbi/search/type?${queryString}`,
      {
        headers: {
          Cookie: homeCookie.join(),
          'User-Agent': USER_AGENT,
        },
      },
    );

    const responseJson = await response.json<BilibiliResponse>();

    const formattedData = get(responseJson.data, ['result'], []);

    if (Array.isArray(formattedData)) {
      return ctx.json(responseJson);
    }
    return ctx.json({}, 500);
  } else {
    throw new HTTPException(401, { message: 'no keys or home cookie' });
  }
});

export default bilibili;

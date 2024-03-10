import { HTTPException } from 'hono/http-exception';
import { FeishuResponse } from '../types';
import { getProfile } from './get-profile';

export async function createCopilot({
  body,
  env,
  authorization,
}: {
  body: Record<string, unknown>;
  env: Env;
  authorization: string;
}) {
  const profile = await getProfile(authorization);

  if (!(profile?.data?.name && profile?.data?.open_id)) {
    throw new HTTPException(401);
  }

  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${env.FEISHU_COPILOT_APP_ID}/tables/${env.FEISHU_COPILOT_HEAD_TABLE_ID}/records`,
    {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          ...body,
          created_by: JSON.stringify({
            user_id: profile.data.open_id,
            provider_type: 'Feishu',
            name: profile.data.name,
          }),
          created_time: Date.now(),
        },
      }),
    },
  );

  const responseJson = await response.json<FeishuResponse>();

  return responseJson;
}

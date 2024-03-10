import { FeishuResponse } from '../types';

export async function getProfile(authorization: string) {
  const response = await fetch(
    'https://open.feishu.cn/open-apis/authen/v1/user_info',
    {
      headers: {
        Authorization: authorization,
      },
    },
  );

  return response.json<FeishuResponse<{ name: string; open_id: string }>>();
}

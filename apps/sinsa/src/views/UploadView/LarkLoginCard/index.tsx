import { Link, useLocation } from '@modern-js/runtime/router';
import { Avatar, Button, Card, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import {
  LARK_SCOPE,
  LOCAL_STORAGE_ACCESS_TOKEN,
  UPLOAD_APP_ID,
} from './constants';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { getFeishuAccessToken, getFeishuProfile } from '@/services/http';
import { FeishuModel } from '@/models/feishu';
import { FeishuAccessTokenSchema } from '@/schemas/feishu-access-token';

export const LarkLoginCard: React.FC = () => {
  const REDIRECT_URI = useMemo(() => {
    return `${window.location.origin}${RoutePath.Upload}/`;
  }, []);

  const [larkpreLoginCode, setLarkpreLoginCode] = useState<string>();
  const location = useLocation();

  useEffect(() => {
    const code = location.search
      .slice(1)
      .split('&')
      .find(item => item.startsWith('code='))
      ?.replace('code=', '');

    if (code) {
      setLarkpreLoginCode(code);
    }
  }, [location.search]);

  const [{ profile }, { setProfile }] = useModel(FeishuModel);

  const { data: maybeAccessToken, loading: loadingAccessToken } = useRequest(
    async () => {
      try {
        const content = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
        const tokenInfo = FeishuAccessTokenSchema.parse(
          content ? JSON.parse(content) : null,
        );
        return tokenInfo;
      } catch {
        // ignore
      }

      if (larkpreLoginCode) {
        const accessTokenInfo = await getFeishuAccessToken({
          code: larkpreLoginCode,
        });

        setLarkpreLoginCode(undefined);
        return accessTokenInfo;
      }
      return undefined;
    },
    {
      refreshDeps: [larkpreLoginCode],
      // onSuccess(_p) {
      //   setProfile(_p);
      // },
    },
  );

  const { loading: loadingProfile } = useRequest(
    async () => {
      if (maybeAccessToken?.access_token) {
        const profile = await getFeishuProfile();
        setProfile(profile);
      }
    },
    {
      refreshDeps: [maybeAccessToken?.access_token],
    },
  );

  const FEISHU_AUTH_URL = useMemo(() => {
    const url = new URL(`https://open.feishu.cn/open-apis/authen/v1/authorize`);
    url.searchParams.append('app_id', UPLOAD_APP_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('scope', LARK_SCOPE);

    return url.href;
  }, []);
  return (
    <Card loading={loadingAccessToken || loadingProfile}>
      {profile ? (
        <Card.Meta
          avatar={<Avatar src={profile.avatar_url} />}
          title={profile.name}
          description="欢迎回来~ 您已授权，可以开始工作啦"
        />
      ) : (
        <Space>
          <Typography.Text>
            您好，我是作业提交醒山小狗，我需要您飞书授权才能工作
          </Typography.Text>
          <Link target="_self" to={FEISHU_AUTH_URL}>
            <Button type="primary">去飞书授权</Button>
          </Link>
        </Space>
      )}
    </Card>
  );
};

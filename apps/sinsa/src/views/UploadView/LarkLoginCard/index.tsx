import { Link, useLocation } from '@modern-js/runtime/router';
import { Avatar, Button, Card, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import { LARK_SCOPE, UPLOAD_APP_ID } from './constants';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { getFeishuProfile, saveAuthCallback } from '@/services/http';
import { FeishuModel } from '@/models/feishu';

export const LarkLoginCard: React.FC = () => {
  const REDIRECT_URI = useMemo(() => {
    return `${window.location.origin}/#${RoutePath.Upload}/`;
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

  const [, { setProfile }] = useModel(FeishuModel);

  const { data, loading } = useRequest(
    async () => {
      if (larkpreLoginCode) {
        await saveAuthCallback({ code: larkpreLoginCode });
        setLarkpreLoginCode(undefined);
      }

      return getFeishuProfile();
    },
    {
      refreshDeps: [larkpreLoginCode],
      onSuccess(_p) {
        setProfile(_p);
      },
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
    <Card loading={loading}>
      {data ? (
        <Card.Meta
          avatar={<Avatar src={data.avatar_url} />}
          title={data.name}
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

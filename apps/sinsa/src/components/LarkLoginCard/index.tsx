import { Link, useLocation } from '@modern-js/runtime/router';
import { Avatar, Button, Card, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { LARK_ORIGIN, LARK_SCOPE, UPLOAD_APP_ID } from './constants';
import type { LarkProfile } from './types';
import { RoutePath } from '@/views/GlobalLayout/constants';

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
    console.log('location', location);
    if (code) {
      setLarkpreLoginCode(code);
    }
  }, [location.search]);

  const { data, loading } = useRequest(
    async () => {
      if (larkpreLoginCode) {
        await fetch(
          `${LARK_ORIGIN}/lark/auth-callback?code=${larkpreLoginCode}`,
          {
            credentials: 'include',
            mode: 'cors',
          },
        ).then(res => res.json());
        setLarkpreLoginCode(undefined);
      }

      const profile = await fetch(`${LARK_ORIGIN}/lark/profile`, {
        credentials: 'include',
        mode: 'cors',
      }).then(res => res.json());

      if (profile?.name) {
        return profile as LarkProfile;
      }
      return null;
    },
    { refreshDeps: [larkpreLoginCode] },
  );
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
          <Link
            target="_self"
            to={`https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=${UPLOAD_APP_ID}&redirect_uri=${window.encodeURIComponent(
              REDIRECT_URI,
            )}&scope=${window.encodeURIComponent(LARK_SCOPE)}`}
          >
            <Button type="primary">去飞书授权</Button>
          </Link>
        </Space>
      )}
    </Card>
  );
};

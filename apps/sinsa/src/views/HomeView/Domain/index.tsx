import { Card, Space, Typography } from 'antd';
import React, { useState } from 'react';
import {
  DOMAIN_ORIGIN,
  DOMAIN_TEXT,
  getCurrentDomainKey,
} from '@/config/domain';

export const DomainCard = React.memo(() => {
  const [domainKey] = useState(() => getCurrentDomainKey());

  return (
    <Card style={{ width: '100%' }}>
      <Card.Meta
        title="站点信息"
        description={
          <Space wrap>
            <div>
              <Typography.Text>您当前访问的是</Typography.Text>
              <Typography.Text strong>{DOMAIN_TEXT[domainKey]}</Typography.Text>
            </div>
            {domainKey !== 'cn' ? (
              <div>
                <Typography.Text type="secondary">
                  访问卡顿？切换至
                </Typography.Text>
                <Typography.Link
                  href={`//${DOMAIN_ORIGIN.cn}`}
                  target="_self"
                  strong
                >
                  {DOMAIN_TEXT.cn}
                </Typography.Link>
              </div>
            ) : (
              <div>
                <Typography.Text type="secondary">切换至</Typography.Text>
                <Typography.Link
                  href={`//${DOMAIN_ORIGIN.i18n}`}
                  target="_self"
                  strong
                >
                  {DOMAIN_TEXT.i18n}
                </Typography.Link>
              </div>
            )}
          </Space>
        }
      />
    </Card>
  );
});

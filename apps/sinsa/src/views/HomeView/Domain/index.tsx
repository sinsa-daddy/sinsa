import { Card, Space, Typography } from 'antd';
import React from 'react';
import { DOMAIN, DomainText } from '@/services/domain';

export const DomainCard = React.memo(() => {
  return (
    <Card style={{ width: '100%' }}>
      <Card.Meta
        title="站点信息"
        description={
          <Space wrap>
            <div>
              <Typography.Text>您当前访问的是</Typography.Text>
              <Typography.Text strong>{DomainText[DOMAIN]}</Typography.Text>
            </div>
            {DOMAIN === 'main' ? (
              <div>
                <Typography.Text type="secondary">
                  访问卡顿？切换至
                </Typography.Text>
                <Typography.Link
                  href="https://sinsa-daddy-webify-4dvq4ad5366bb-1255364977.tcloudbaseapp.com"
                  target="_self"
                  strong
                >
                  {DomainText.backup}
                </Typography.Link>
              </div>
            ) : (
              <div>
                <Typography.Text type="secondary">切换至</Typography.Text>
                <Typography.Link href="https://sinsa.dad" target="_self" strong>
                  {DomainText.main}
                </Typography.Link>
              </div>
            )}
          </Space>
        }
      />
    </Card>
  );
});

import { Card, Space, Typography, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  DOMAIN_ORIGIN,
  DOMAIN_TEXT,
  getCurrentDomainKey,
} from '@/config/domain';

export const DomainCard = React.memo(() => {
  const [domainKey] = useState(() => getCurrentDomainKey());

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (domainKey === 'unknown') {
      modal.confirm({
        title: '域名变更说明',
        content: (
          <div>
            <p>
              本站决定将国内访问地址更换到新域名:{' '}
              <Typography.Text strong copyable>
                sinsa.top
              </Typography.Text>
            </p>
            <p>
              之后红油扳手作业站将会统一有两个域名: <br />
              <Typography.Text strong>
                {DOMAIN_ORIGIN.cn} (国内访问)
              </Typography.Text>{' '}
              和{' '}
              <Typography.Text strong>
                {DOMAIN_ORIGIN.i18n} (国外访问)
              </Typography.Text>
            </p>
            <p>
              如果您已经将本站添加到屏幕, 请在重新添加一次,
              并且可以把旧站点收藏夹或者书签删除
            </p>
            <p>感谢大家的支持</p>
          </div>
        ),
        okText: '立即访问',
        cancelText: '以后再说',
        onOk() {
          window.location.host = DOMAIN_ORIGIN.cn;
        },
      });
    }
  }, [domainKey]);
  return (
    <Card style={{ width: '100%' }}>
      {contextHolder}
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

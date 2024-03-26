import { Button, Card, Flex, Image, Typography } from 'antd';
import React from 'react';
import { Link } from '@modern-js/runtime/router';
import styles from './page.styles.module.less';
import { HeroSection } from './Hero';
import { CoolCanvas } from './CoolCanvas';
import { DomainCard } from './Domain';
import QunURL from '@/assets/docs/qun.webp';
import { DOMAIN } from '@/services/domain';

export const HomeView = React.memo(() => {
  return (
    <>
      <CoolCanvas />
      <HeroSection />
      <Flex className={styles.MainBody} vertical wrap="nowrap" gap={12}>
        <DomainCard />

        <Card>
          <Card.Meta
            title="作业收录"
            description={
              <Typography.Paragraph>
                如果您是我们的作业收录同学，可以从这里跳转到对应收录页面，需要您
                <Typography.Text strong>
                  有飞书账号且加入我们红油扳手飞书群
                </Typography.Text>
              </Typography.Paragraph>
            }
          />
          <div>
            {DOMAIN === 'main' ? (
              <Link to={`/upload`}>
                <Button type="primary">去收录</Button>
              </Link>
            ) : (
              <Link to={`https://sinsa-daddy.com/upload`} target="_self">
                <Button type="primary">去 sinsa-daddy.com 收录</Button>
              </Link>
            )}
          </div>
        </Card>
        <Card>
          <Card.Meta
            title="联系我们"
            description={
              <Typography.Paragraph>
                网站依然正在完善并且变得更好，我们也仍然十分缺少收录作业数据工。如果您也想参与作业收录工作，可以加入我们
                QQ 群，我们会提供收录权限。
              </Typography.Paragraph>
            }
          />

          <Image width={100} src={QunURL} alt="qun" />
        </Card>
        <div></div>
      </Flex>
    </>
  );
});

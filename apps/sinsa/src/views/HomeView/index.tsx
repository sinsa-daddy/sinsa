import { Button, Card, Flex, Grid, Image, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from '@modern-js/runtime/router';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './page.styles.module.less';
import { HeroSection } from './Hero';
import { CoolCanvas } from './CoolCanvas';
import { DomainCard } from './Domain';
import { HOME_DISPLAY_DATA } from './constants';
import { DOMAIN_ORIGIN, getCurrentDomainKey } from '@/config/domain';
import { HomeCarousel } from '@/components/HomeCarousel';
import { VIDEO_WIDTH } from '@/components/HomeCarousel/constants';

export const HomeView = React.memo(() => {
  const screen = Grid.useBreakpoint();
  const [domainKey] = useState(() => getCurrentDomainKey());

  return (
    <>
      <CoolCanvas />
      <HeroSection />
      <Flex className={styles.MainBody} wrap="wrap" gap={12}>
        <div style={{ width: screen.xs ? '100%' : VIDEO_WIDTH }}>
          <AutoSizer disableHeight>
            {({ width }) => {
              return (
                <HomeCarousel
                  style={{
                    width,
                  }}
                  dataSource={HOME_DISPLAY_DATA}
                />
              );
            }}
          </AutoSizer>
        </div>

        <Card style={{ flexBasis: 0, flexGrow: 1 }}>
          <Card.Meta
            title="养老聊天"
            description={
              <>
                <Typography.Paragraph>
                  白夜极光红油扳手作业站用户群
                </Typography.Paragraph>
              </>
            }
          />

          <Image
            width={150}
            src={`https://s2.loli.net/2024/03/26/JyYRDFPGTHq479o.webp`}
            alt="qun"
          />
        </Card>
        <Card style={{ width: '100%' }}>
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
            {domainKey === 'i18n' ? (
              <Link to={`/upload`}>
                <Button type="primary">去收录</Button>
              </Link>
            ) : (
              <Link
                to={`https://${DOMAIN_ORIGIN.i18n}/#/upload`}
                target="_self"
              >
                <Button type="primary">去 {DOMAIN_ORIGIN.i18n} 收录</Button>
              </Link>
            )}
          </div>
        </Card>
        <DomainCard />
      </Flex>
    </>
  );
});

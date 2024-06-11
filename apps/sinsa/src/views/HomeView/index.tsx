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
            title="联系我们"
            description={
              <>
                <Typography.Paragraph>
                  为了及时向我们反馈，我们的<strong>官方哔哩哔哩账号</strong>是
                  <br />
                  <Link
                    to={`https://space.bilibili.com/3546672269363687/dynamic`}
                    target="_blank"
                  >
                    <strong>@红油扳手作业站</strong>
                  </Link>
                </Typography.Paragraph>
                <Typography.Paragraph>
                  网站依然正在完善并且变得更好。如果您荒典最高排名进入过
                  ，亦或者如果您也想参与作业收录工作，可以加入我们 QQ
                  群，我们会提供收录权限。
                </Typography.Paragraph>
              </>
            }
          />

          <Image
            width={100}
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

import { Button, Card, Grid, Flex, Image, Typography } from 'antd';
import React from 'react';
import { Link } from '@modern-js/runtime/router';
import { Play } from '@icon-park/react';
import styles from './page.styles.module.less';
import { HeroSection } from './Hero';
import { CoolCanvas } from './CoolCanvas';
import { DomainCard } from './Domain';
import QunURL from '@/assets/docs/qun.webp';
import { DOMAIN } from '@/services/domain';

const VIDEO_WIDTH = 390 - 12 * 2;

export const HomeView = React.memo(() => {
  const screen = Grid.useBreakpoint();

  return (
    <>
      <CoolCanvas />
      <HeroSection />
      <Flex className={styles.MainBody} wrap="wrap" gap={12}>
        <Card
          style={{ width: screen.xs ? '100%' : VIDEO_WIDTH }}
          cover={
            <img
              style={{ objectFit: 'cover', background: 'gray' }}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              width={VIDEO_WIDTH}
              height={VIDEO_WIDTH / (320 / 200)}
              src={`//i0.hdslb.com/bfs/archive/6cc7f841b02d94dfe2f5030d196513d34f8caa9b.jpg`}
            />
          }
        >
          <Card.Meta
            title="教学视频"
            description={
              <Typography.Paragraph>
                由站长配音解说红油扳手作业站正确使用姿势，助您抄作业事半功倍
              </Typography.Paragraph>
            }
          />
          <Link
            to={'https://www.bilibili.com/video/BV17u4m1P7sq/'}
            target="_blank"
          >
            <Button type="primary" ghost icon={<Play />}>
              观看视频
            </Button>
          </Link>
        </Card>
        <Card style={{ flexBasis: 0, flexGrow: 1 }}>
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
            {DOMAIN === 'main' ? (
              <Link to={`/upload`}>
                <Button type="primary">去收录</Button>
              </Link>
            ) : (
              <Link to={`https://sinsa.dad/upload`} target="_self">
                <Button type="primary">去 sinsa.dad 收录</Button>
              </Link>
            )}
          </div>
        </Card>
        <DomainCard />
      </Flex>
    </>
  );
});

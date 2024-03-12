import { PageContainer, useBreakpoint } from '@ant-design/pro-components';
import { Button, Checkbox, Image, Tag, Typography } from 'antd';
import React, { useMemo } from 'react';
import { Link } from '@modern-js/runtime/router';
import QunURL from '@/assets/docs/qun.webp';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { DarkModeButton } from '@/components/DarkModeButton';

const IS_MAIN =
  window.location.hostname === 'sinsa-daddy.com' ||
  window.location.hostname === 'localhost';

const Index = React.memo(() => {
  const screen = useBreakpoint();
  const isLarge = useMemo(
    () => screen === 'lg' || screen === 'xl' || screen === 'xxl',
    [screen],
  );

  return (
    <PageContainer
      title="红油扳手作业站"
      content={
        '红油扳手作业站是一站式作业收录平台，目前由我们民间团队手动收录哔哩哔哩上的作业。'
      }
      extra={isLarge ? <DarkModeButton /> : null}
    >
      <Typography.Paragraph>
        Github地址{' '}
        <Typography.Link
          href="https://github.com/sinsa-daddy/sinsa"
          target="_blank"
        >
          https://github.com/sinsa-daddy/sinsa
        </Typography.Link>
      </Typography.Paragraph>
      <Typography.Paragraph>
        目前网站仍然有很多问题，我们十分缺少收录作业数据工。如果您也想参与作业收录工作，可以加入我们
        QQ 群，我们会提供收录权限（我们通过飞书文档维护数据库）。
      </Typography.Paragraph>
      <Image width={100} src={QunURL} alt="qun" />
      <Typography.Title level={4}>我们提供以下能力</Typography.Title>
      <div>
        <Checkbox checked={true}>根据收录作业提供最佳队伍匹配方案</Checkbox>
        <Link to={RoutePath.Solutions('latest')}>
          <Button type="primary">立即试试</Button>
        </Link>
      </div>
      <div>
        <Checkbox checked={true}>当期荒典词条信息</Checkbox>
        <Link to={RoutePath.Copilots('latest')}>
          <Button type="primary">立即看看</Button>
        </Link>
      </div>
      <Typography.Title level={4}>站点</Typography.Title>
      <Typography.Paragraph>
        首发站点{' '}
        <Typography.Link href="https://sinsa-daddy.com" target="_self">
          https://sinsa-daddy.com
        </Typography.Link>{' '}
        <Tag color="blue">推荐</Tag>
      </Typography.Paragraph>
      <Typography.Title level={4}>作业收录</Typography.Title>
      <Typography.Paragraph>
        如果您是我们的作业收录同学，可以从这里跳转到对应收录页面，需要您
        <Typography.Text strong>
          有飞书账号且加入我们红油扳手飞书群
        </Typography.Text>
      </Typography.Paragraph>
      {IS_MAIN ? (
        <Link to={`/upload`}>
          <Button type="primary">去收录</Button>
        </Link>
      ) : (
        <Link to={`https://sinsa-daddy.com/#/upload`} target="_self">
          <Button type="primary">去 sinsa-daddy.com 收录</Button>
        </Link>
      )}
    </PageContainer>
  );
});

export default Index;

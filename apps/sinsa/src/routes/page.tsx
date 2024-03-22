import type { DescriptionsProps } from 'antd';
import {
  Button,
  Card,
  Flex,
  Image,
  Tag,
  Typography,
  Descriptions,
  Space,
} from 'antd';
import React from 'react';
import { Link } from '@modern-js/runtime/router';
import QunURL from '@/assets/docs/qun.webp';
// import { DarkModeButton } from '@/components/DarkModeButton';
import { HeroSection } from '@/components/Hero';

const IS_MAIN =
  window.location.hostname === 'sinsa-daddy.com' ||
  window.location.hostname === 'localhost';

const items: DescriptionsProps['items'] = [
  {
    label: '首发站点',
    key: '1st',
    children: (
      <Space>
        <Typography.Link href="https://sinsa-daddy.com" target="_self">
          https://sinsa-daddy.com
        </Typography.Link>
        <Tag color="blue">推荐</Tag>
      </Space>
    ),
  },
  {
    label: '备用站点',
    key: '2nd',
    children: (
      <Typography.Link href="https://sinsa-daddy.gitee.io" target="_blank">
        https://sinsa-daddy.gitee.io
      </Typography.Link>
    ),
  },
  {
    label: 'Github',
    key: 'github',
    children: (
      <Typography.Link
        href="https://github.com/sinsa-daddy/sinsa"
        target="_blank"
      >
        https://github.com/sinsa-daddy/sinsa
      </Typography.Link>
    ),
  },
];

const Index = React.memo(() => {
  return (
    <>
      <HeroSection />
      <Flex vertical wrap="nowrap" gap={12}>
        <Card size="small">
          <Descriptions
            size="small"
            column={{ xs: 1, sm: 2, md: 3, lg: 3 }}
            items={items}
          />
        </Card>

        <Card size="small">
          <Typography.Paragraph>
            如果您是我们的作业收录同学，可以从这里跳转到对应收录页面，需要您
            <Typography.Text strong>
              有飞书账号且加入我们红油扳手飞书群
            </Typography.Text>
          </Typography.Paragraph>
          <div>
            {IS_MAIN ? (
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
        <Card size="small">
          <Typography.Paragraph>
            网站依然正在完善并且变得更好，我们也仍然十分缺少收录作业数据工。如果您也想参与作业收录工作，可以加入我们
            QQ 群，我们会提供收录权限。
          </Typography.Paragraph>
          <Image width={100} src={QunURL} alt="qun" />
        </Card>
      </Flex>
    </>
  );
});

export default Index;

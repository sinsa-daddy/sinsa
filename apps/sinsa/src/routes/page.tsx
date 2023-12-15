import { PageContainer } from '@ant-design/pro-components';
import { Button, Checkbox, Image, Tag, Typography } from 'antd';
import React from 'react';
import { Link } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import QunURL from '@/assets/docs/qun.webp';
import { TermsModel } from '@/models/terms';
import { RoutePath } from '@/components/MyLayout/constants';

const Index = React.memo(() => {
  const [{ firstTerm }] = useModel(TermsModel);
  return (
    <PageContainer
      title="红油扳手作业站"
      content={
        '红油扳手作业站是一站式作业收录平台，目前由我们民间团队手动收录哔哩哔哩上的作业。'
      }
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
        {firstTerm ? (
          <Link
            id="link-jump-to-solutions"
            to={RoutePath.Solutions(firstTerm.term)}
          >
            <Button type="primary">立即试试</Button>
          </Link>
        ) : null}
      </div>
      <div>
        <Checkbox checked={false}>当期荒典词条信息</Checkbox>
      </div>
      <div>
        <Checkbox checked={false}>
          提供自己的 Box，根据自己的 Box 计算最佳队伍搭配方案。Box
          会在用户本地存储
        </Checkbox>
      </div>
      <div>
        <Checkbox checked={false}>提供 Chrome 插件，改善作业收录体验</Checkbox>
      </div>
      <Typography.Title level={4}>镜像站点</Typography.Title>
      <Typography.Paragraph>
        本站点部署在 Github Pages
        上，国内访问可能较慢。我们之后会提供国内镜像站点
      </Typography.Paragraph>
      <Typography.Paragraph>
        首发站点{' '}
        <Typography.Link href="https://sinsa-daddy.github.io/" target="_blank">
          https://sinsa-daddy.github.io/
        </Typography.Link>
      </Typography.Paragraph>
      <Typography.Paragraph>
        国外镜像站点{' '}
        <Typography.Link href="https://sinsa-daddy.pages.dev/" target="_blank">
          https://sinsa-daddy.pages.dev/
        </Typography.Link>{' '}
        <Tag color="blue">推荐</Tag>
      </Typography.Paragraph>
      <Typography.Paragraph>
        国外镜像站点{' '}
        <Typography.Link
          href="https://sinsa-daddy.netlify.app/"
          target="_blank"
        >
          https://sinsa-daddy.netlify.app/
        </Typography.Link>{' '}
      </Typography.Paragraph>
    </PageContainer>
  );
});

export default Index;

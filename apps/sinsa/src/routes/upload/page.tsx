import { PageContainer } from '@ant-design/pro-components';
import { Flex } from 'antd';
import { UploadForm } from '@/components/UploadForm';
import { LarkLoginCard } from '@/views/UploadView/LarkLoginCard';

const UploadPage: React.FC = () => {
  return (
    <PageContainer
      title="作业收录（内部版）"
      content="内部的收录同学可以使用此页面快速上传作业，之后会再提供 Chrome 插件提高效率（比心）"
    >
      <Flex vertical gap="middle">
        <LarkLoginCard />
        <UploadForm />
      </Flex>
    </PageContainer>
  );
};

export default UploadPage;

import { PageContainer } from '@ant-design/pro-components';
import { UploadForm } from '@/components/UploadForm';

const UploadPage: React.FC = () => {
  return (
    <PageContainer
      title="作业收录（内部版）"
      content="内部的收录同学可以使用此页面快速上传作业，之后会再提供 Chrome 插件提高效率（比心）"
    >
      <UploadForm />
    </PageContainer>
  );
};

export default UploadPage;

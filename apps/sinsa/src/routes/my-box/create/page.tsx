import { PageContainer } from '@ant-design/pro-components';
import { CreateMyBoxForm } from '@/components/CreateMyBoxForm';

const CreateMyBoxPage: React.FC = () => {
  return (
    <PageContainer title="创建自定义 Box">
      <CreateMyBoxForm />
    </PageContainer>
  );
};

export default CreateMyBoxPage;

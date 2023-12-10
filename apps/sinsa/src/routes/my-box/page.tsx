import { PageContainer } from '@ant-design/pro-layout';
import { MyBoxList } from '@/components/MyBoxList';

const MyBoxPage: React.FC = () => {
  return (
    <PageContainer title="我的自定义 Box">
      <MyBoxList dataSource={[]} />
    </PageContainer>
  );
};

export default MyBoxPage;

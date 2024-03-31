import { PageContainer } from '@ant-design/pro-components';
import { GachaAnalyseView } from '@/views/GachaAnalyseView';

const GachaAnalyse: React.FC = () => {
  return (
    <PageContainer title="非洲极光" loading={false}>
      <GachaAnalyseView />
    </PageContainer>
  );
};

export default GachaAnalyse;

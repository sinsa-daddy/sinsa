import { PageContainer } from '@ant-design/pro-layout';
import { CopilotType } from '@sinsa/schema';

interface CopilotsViewProps {
  isLoading: boolean;
  data?: Record<CopilotType['bv'], CopilotType>;
}

export const CopilotsView: React.FC<CopilotsViewProps> = ({
  isLoading,
  data,
}) => {
  return (
    <PageContainer title="荒典作业" loading={isLoading}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </PageContainer>
  );
};

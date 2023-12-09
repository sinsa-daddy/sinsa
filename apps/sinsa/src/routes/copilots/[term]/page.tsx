import { useParams } from '@modern-js/runtime/router';
import useSWR from 'swr';
import { PageContainer } from '@ant-design/pro-layout';
import { fetcher } from '@/utils/swr';
import { TermNotFound } from '@/containers/TermNotFound';
import { CopilotHeader } from '@/containers/CopilotHeader';
import { CopilotSolution } from '@/containers/CopilotSolution';

const CopilotPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();

  const { data, error, isLoading } = useSWR(
    `/api/copilots/${params.term}.json`,
    fetcher,
  );

  if (error) {
    return <TermNotFound />;
  }

  return (
    <PageContainer
      content={<CopilotHeader />}
      title="荒典作业"
      loading={isLoading}
    >
      <CopilotSolution copilotsDataSource={data} />
    </PageContainer>
  );
};

export default CopilotPage;

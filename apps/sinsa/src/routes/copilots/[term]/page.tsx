import { useParams } from '@modern-js/runtime/router';
import useSWR from 'swr';
import { PageContainer } from '@ant-design/pro-layout';
import { fetcher } from '@/utils/swr';
import { TermNotFound } from '@/containers/TermNotFound';
import { CopilotFilter } from '@/containers/CopilotFilter';

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
    <PageContainer title="荒典作业" loading={isLoading}>
      <CopilotFilter />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </PageContainer>
  );
};

export default CopilotPage;

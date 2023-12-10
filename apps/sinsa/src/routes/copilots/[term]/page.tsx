import { useParams } from '@modern-js/runtime/router';
import useSWR from 'swr';
import { PageContainer } from '@ant-design/pro-layout';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { fetcher } from '@/utils/swr';
import { TermNotFound } from '@/containers/TermNotFound';
import { CopilotHeader } from '@/containers/CopilotHeader';
import { CopilotSolution } from '@/containers/CopilotSolution';
import { CopilotsTable } from '@/components/CopilotsTable';

const CopilotPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();

  const { data, error, isLoading } = useSWR<
    Record<CopilotType['bv'], CopilotType>
  >(`/api/copilots/${params.term}.json`, fetcher);

  const copilots = useMemo(() => Object.values(data ?? []), [data]);

  if (error) {
    return <TermNotFound />;
  }

  return (
    <PageContainer
      content={<CopilotHeader />}
      title="荒典作业"
      loading={isLoading}
    >
      <CopilotsTable term={params.term} dataSource={copilots} />
      <CopilotSolution dataSource={copilots} />
    </PageContainer>
  );
};

export default CopilotPage;

import { useParams } from '@modern-js/runtime/router';
import useSWR from 'swr';
import { PageContainer } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { fetcher } from '@/utils/swr';
import { TermNotFound } from '@/containers/TermNotFound';
import { CopilotHeader } from '@/containers/CopilotHeader';
import { CopilotsTable } from '@/components/CopilotsTable';

const CopilotsPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();

  const { data, error, isLoading } = useSWR<
    Record<CopilotType['bv'], CopilotType>
  >(params.term ? `/api/copilots/${params.term}.json` : null, fetcher);

  const copilots = useMemo(() => Object.values(data ?? []), [data]);

  if (error) {
    return <TermNotFound />;
  }

  return (
    <PageContainer
      content={<CopilotHeader />}
      title="作业全览"
      loading={isLoading}
    >
      <CopilotsTable term={params.term} dataSource={copilots} />
    </PageContainer>
  );
};

export default CopilotsPage;

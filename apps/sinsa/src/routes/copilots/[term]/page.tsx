import { useParams } from '@modern-js/runtime/router';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { TermNotFound } from '@/containers/TermNotFound';
import { TermChanger } from '@/containers/TermChanger';
import { CopilotsTable } from '@/components/CopilotsTable';
import { RoutePath } from '@/components/MyLayout/constants';

const CopilotsPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();

  const { data, error, loading } = useRequest(
    () =>
      fetch(`/api/copilots/${params.term}.json`).then(
        response =>
          response.json() as Promise<Record<CopilotType['bv'], CopilotType>>,
      ),
    { refreshDeps: [params.term] },
  );

  const copilots = useMemo(() => Object.values(data ?? []), [data]);

  if (error) {
    return <TermNotFound />;
  }

  return (
    <PageContainer
      content={<TermChanger pathFn={RoutePath.Copilots} />}
      title="作业全览"
      loading={loading}
    >
      <CopilotsTable term={params.term} dataSource={copilots} />
    </PageContainer>
  );
};

export default CopilotsPage;

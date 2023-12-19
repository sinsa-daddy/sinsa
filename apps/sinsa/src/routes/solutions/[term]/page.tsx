import { useParams } from '@modern-js/runtime/router';
import { PageContainer } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { TermNotFound } from '@/containers/TermNotFound';
import { TermChanger } from '@/containers/TermChanger';
import { CopilotSolution } from '@/containers/CopilotSolution';
import { RoutePath } from '@/components/MyLayout/constants';

const SolutionsPage: React.FC = () => {
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
      content={<TermChanger pathFn={RoutePath.Solutions} />}
      title="作业匹配"
      loading={loading}
    >
      {params.term ? (
        <CopilotSolution dataSource={copilots} term={params.term} />
      ) : null}
    </PageContainer>
  );
};

export default SolutionsPage;

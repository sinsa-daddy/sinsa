import { useParams, useLocation } from '@modern-js/runtime/router';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { TermNotFound } from '@/containers/TermNotFound';
import { TermChanger } from '@/containers/TermChanger';
import { CopilotsTable } from '@/components/CopilotsTable';
import { RoutePath } from '@/components/MyLayout/constants';
import { WalineComment } from '@/components/WalineComment';
import { COMMENT_BACKEND_SERVER_URL } from '@/constants/comment';

const CopilotsPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();
  const location = useLocation();

  const { data, error, loading } = useRequest(
    () =>
      fetch(`/api/copilots/${params.term}.json`).then(
        response =>
          response.json() as Promise<Record<CopilotType['bv'], CopilotType>>,
      ),
    { refreshDeps: [params.term] },
  );

  const copilots = useMemo(() => Object.values(data ?? []), [data]);

  return (
    <PageContainer
      content={<TermChanger pathFn={RoutePath.Copilots} />}
      title="作业全览"
      loading={loading}
    >
      {error ? (
        <TermNotFound />
      ) : (
        <>
          <CopilotsTable term={params.term} dataSource={copilots} />
          <WalineComment
            serverURL={COMMENT_BACKEND_SERVER_URL}
            path={location.pathname}
          />
        </>
      )}
    </PageContainer>
  );
};

export default CopilotsPage;

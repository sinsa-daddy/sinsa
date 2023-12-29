import { useParams } from '@modern-js/runtime/router';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { TermNotFound } from '@/containers/TermNotFound';
import { TermChanger } from '@/containers/TermChanger';
import { CopilotsTable } from '@/components/CopilotsTable';
import { TermsModel } from '@/models/terms';
import { http } from '@/services/fetch';
import { RoutePath } from '@/views/GlobalLayout/constants';

const CopilotsPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();
  const [{ termsMap }] = useModel(TermsModel);
  const currentTerm = useMemo(
    () => params.term && termsMap[params.term],
    [params.term],
  );

  const { data, error, loading } = useRequest(
    () =>
      currentTerm?.term
        ? http.getCopilots(currentTerm.term)
        : (Promise.resolve({}) as ReturnType<typeof http.getCopilots>),
    { ready: Boolean(currentTerm?.term), refreshDeps: [currentTerm?.term] },
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
        <CopilotsTable currentTerm={currentTerm} dataSource={copilots} />
      )}
    </PageContainer>
  );
};

export default CopilotsPage;

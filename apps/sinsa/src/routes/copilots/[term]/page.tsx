import { useParams } from '@modern-js/runtime/router';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { TermNotFound } from '@/components/TermNotFound';
import { TermChanger } from '@/components/TermChanger';
import { CopilotsTable } from '@/components/CopilotsTable';
import { TermsModel } from '@/models/terms';
import { getCopilots } from '@/services/http';
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
        ? getCopilots(currentTerm.term)
        : (Promise.resolve({}) as ReturnType<typeof getCopilots>),
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

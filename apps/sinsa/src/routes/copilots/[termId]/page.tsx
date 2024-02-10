/* eslint-disable no-nested-ternary */
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { TermNotFound } from '@/components/TermNotFound';
import { TermChanger, useTargetTermFromParams } from '@/components/TermChanger';
import { getCopilots } from '@/services/http';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { CopilotsView } from '@/views/CopilotsView';

const CopilotsPage: React.FC = () => {
  const { targetTerm: currentTerm } = useTargetTermFromParams();

  const { data, error, loading } = useRequest(
    () =>
      currentTerm?.term_id
        ? getCopilots(currentTerm.term_id)
        : (Promise.resolve({}) as ReturnType<typeof getCopilots>),
    {
      ready: Boolean(currentTerm?.term_id),
      refreshDeps: [currentTerm?.term_id],
    },
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
      ) : currentTerm ? (
        <CopilotsView currentTerm={currentTerm} copilots={copilots} />
      ) : (
        <TermNotFound />
      )}
    </PageContainer>
  );
};

export default CopilotsPage;

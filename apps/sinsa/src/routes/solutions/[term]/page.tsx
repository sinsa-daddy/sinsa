/* eslint-disable no-nested-ternary */
import { useParams } from '@modern-js/runtime/router';
import { PageContainer } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import { TermNotFound } from '@/containers/TermNotFound';
import { TermChanger } from '@/containers/TermChanger';
import { CopilotSolution } from '@/containers/CopilotSolution';
import { RoutePath } from '@/components/MyLayout/constants';
import { TermsModel } from '@/models/terms';

const SolutionsPage: React.FC = () => {
  const params = useParams<{ term: `${number}` }>();
  const [{ termsMap }] = useModel(TermsModel);
  const currentTerm = useMemo(
    () => params.term && termsMap[params.term],
    [params.term],
  );

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
      content={<TermChanger pathFn={RoutePath.Solutions} />}
      title="作业匹配"
      loading={loading}
    >
      {error ? (
        <TermNotFound />
      ) : currentTerm ? (
        <CopilotSolution dataSource={copilots} currentTerm={currentTerm} />
      ) : null}
    </PageContainer>
  );
};

export default SolutionsPage;

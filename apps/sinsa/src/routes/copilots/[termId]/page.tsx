/* eslint-disable no-nested-ternary */
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { Flex, Space } from 'antd';
import { TermNotFound } from '@/components/TermNotFound';
import { TermChanger, useTargetTermFromParams } from '@/components/TermChanger';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { CopilotsView } from '@/views/CopilotsView';
import { CopilotSorterProvider } from '@/views/CopilotsView/CopilotListView/CopilotSortContext';
import { CopilotSelect } from '@/views/CopilotsView/CopilotListView/CopilotSortContext/select';
import { BossCard } from '@/components/BossCard';
import { getRerunsCopilots } from '@/services/get-reruns';

const CopilotsPage: React.FC = () => {
  const { targetTerm: currentTerm } = useTargetTermFromParams();

  const { data, error, loading } = useRequest(
    () =>
      currentTerm?.term_id
        ? getRerunsCopilots(currentTerm)
        : (Promise.resolve({}) as ReturnType<typeof getRerunsCopilots>),
    {
      ready: Boolean(currentTerm?.term_id),
      refreshDeps: [currentTerm?.term_id],
    },
  );

  const copilots = useMemo(() => Object.values(data ?? []), [data]);

  return (
    <CopilotSorterProvider>
      <PageContainer
        content={
          <Space>
            <TermChanger pathFn={RoutePath.Copilots} />
            <CopilotSelect />
          </Space>
        }
        title="作业全览"
        loading={loading}
      >
        <Flex vertical gap="middle">
          {currentTerm ? <BossCard term={currentTerm} /> : null}
          {error || !copilots?.length ? (
            <TermNotFound />
          ) : currentTerm ? (
            <CopilotsView currentTerm={currentTerm} copilots={copilots} />
          ) : (
            <TermNotFound />
          )}
        </Flex>
      </PageContainer>
    </CopilotSorterProvider>
  );
};

export default CopilotsPage;

/* eslint-disable no-nested-ternary */
import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Space, Typography } from 'antd';
import { TermNotFound } from '@/components/TermNotFound';
import { TermChanger, useTargetTermFromParams } from '@/components/TermChanger';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { RelativeTimeText } from '@/components/RelativeTimeText';
import { SolutionView } from '@/views/SolutionView';
import { getRerunsCopilots } from '@/services/get-reruns';

const SolutionsPage: React.FC = () => {
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
    <PageContainer
      content={
        <Space wrap>
          <TermChanger pathFn={RoutePath.Solutions} />
          {copilots[0] ? (
            <Typography.Text>
              上次作业更新 <RelativeTimeText time={copilots[0].upload_time} />
            </Typography.Text>
          ) : null}
          <Typography.Text type="secondary">
            Tips: 点击匹配作业中光灵头像可唤出菜单一键排除光灵或仅排除突破 ❤
          </Typography.Text>
        </Space>
      }
      title="作业匹配"
      loading={loading}
    >
      {error || !copilots?.length ? (
        <TermNotFound />
      ) : currentTerm ? (
        <SolutionView copilots={copilots} currentTerm={currentTerm} />
      ) : (
        <TermNotFound />
      )}
    </PageContainer>
  );
};

export default SolutionsPage;

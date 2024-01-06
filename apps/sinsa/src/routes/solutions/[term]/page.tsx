/* eslint-disable no-nested-ternary */
import { useParams } from '@modern-js/runtime/router';
import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import { Space, Typography } from 'antd';
import { TermNotFound } from '@/containers/TermNotFound';
import { TermChanger } from '@/containers/TermChanger';
import { CopilotSolution } from '@/containers/CopilotSolution';
import { TermsModel } from '@/models/terms';
import { getCopilots } from '@/services/http';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { RelativeTimeText } from '@/components/RelativeTimeText';

const SolutionsPage: React.FC = () => {
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
      {error ? (
        <TermNotFound />
      ) : currentTerm ? (
        <CopilotSolution dataSource={copilots} currentTerm={currentTerm} />
      ) : null}
    </PageContainer>
  );
};

export default SolutionsPage;

/* eslint-disable no-nested-ternary */
import { useParams } from '@modern-js/runtime/router';
import { PageContainer } from '@ant-design/pro-components';
import type { CopilotType } from '@sinsa/schema';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import { Space, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import styles from './styles.module.less';
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
      fetch(`/api/copilots/${params.term}.json?t=${Date.now()}`).then(
        response =>
          response.json() as Promise<Record<CopilotType['bv'], CopilotType>>,
      ),
    { refreshDeps: [params.term] },
  );

  const copilots = useMemo(() => Object.values(data ?? []), [data]);

  return (
    <PageContainer
      content={
        <Space>
          <TermChanger pathFn={RoutePath.Solutions} />
          {copilots[0] ? (
            <Typography.Text>
              上次作业更新{' '}
              <Tooltip
                title={dayjs(copilots[0].upload_time).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              >
                <span className={styles.LatestUpdatedText}>
                  {dayjs(copilots[0].upload_time).fromNow()}
                </span>
              </Tooltip>
            </Typography.Text>
          ) : null}
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

import { ConfigProvider, Empty, List, Result, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import type { TermNextType } from '@sinsa/schema';
import { useSolutionResultContext } from '../context';
import styles from './styles.module.less';
import SINSA_SORRY_URL from '@/assets/sinsa/sorry.png';
import SINSA_GO_URL from '@/assets/sinsa/get_started.png';
import { SolutionCard } from '@/components/SolutionCard';

const getRowKey = (sc: Solution) =>
  sc.copilots.map(c => c.copilot_id).join(',');

const EmptyImageStyle: React.CSSProperties = { opacity: 0.5 };

export interface SolutionListViewProps {
  currentTerm: TermNextType;
}

export const SolutionListView: React.FC<SolutionListViewProps> = ({
  currentTerm,
}) => {
  const inViewRef = useRef<HTMLDivElement>(null);

  const { loadingSolutionResult, solutionResult } = useSolutionResultContext();

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (solutionResult && current !== 1) {
      setCurrent(1);
    }
  }, [solutionResult]);

  const pagination = useMemo(() => {
    return {
      align: 'center' as const,
      defaultPageSize: 5,
      current,
      onChange(page: number) {
        setCurrent(page);
        window.scrollTo({
          top: inViewRef.current!.offsetTop,
          behavior: 'smooth',
        });
      },
      showSizeChanger: false,
    };
  }, [current]);

  return (
    <>
      <div className={styles.Mount} ref={inViewRef} />
      <ConfigProvider
        renderEmpty={name => {
          if (name === 'List') {
            return solutionResult?.allSolutions.solutions.length === 0 ? (
              <Result
                icon={
                  <img
                    width={100}
                    src={SINSA_SORRY_URL}
                    alt="醒山daddy: 很抱歉"
                  />
                }
                title="没能找到匹配的作业"
                subTitle={
                  <div>
                    1. 可以适当降低搜索的队伍数量。例如搜索两队 + 自己自动一队
                    <br />
                    2. 当前作业数量较少。可等待作业站更新后再次搜索
                  </div>
                }
              />
            ) : (
              <Empty
                image={<img src={SINSA_GO_URL} alt="醒山daddy: 信心" />}
                imageStyle={EmptyImageStyle}
                description={
                  <Typography.Text type="secondary">
                    准备好寻找作业匹配了！
                  </Typography.Text>
                }
              />
            );
          }
          return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }}
      >
        <List<Solution>
          loading={loadingSolutionResult}
          dataSource={solutionResult?.allSolutions.solutions}
          pagination={pagination}
          rowKey={getRowKey}
          renderItem={item => (
            <SolutionCard
              index={solutionResult?.rankSet.get(item) ?? 0}
              solution={item}
              currentTerm={currentTerm}
            />
          )}
        />
      </ConfigProvider>
    </>
  );
};

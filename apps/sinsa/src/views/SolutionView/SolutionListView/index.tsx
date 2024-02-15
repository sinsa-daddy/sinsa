import { ConfigProvider, Empty, List, Result, notification } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash-es';
import type { TermNextType } from '@sinsa/schema';
import { useSolutionResultContext } from '../context';
import type { ExcludeDataType, QueryParamsType } from '../schemas/query-params';
import styles from './styles.module.less';
import SINSA_SORRY_URL from '@/assets/sinsa/sorry.png';
import { SolutionCard } from '@/components/SolutionCard';
import type { IgnoreMessage } from '@/components/types';

const getRowKey = (sc: Solution) =>
  sc.copilots.map(c => c.copilot_id).join(',');

export interface SolutionListViewProps {
  currentTerm: TermNextType;
}

export const SolutionListView: React.FC<SolutionListViewProps> = ({
  currentTerm,
}) => {
  const inViewRef = useRef<HTMLDivElement>(null);

  const { loadingSolutionResult, solutionResult, form } =
    useSolutionResultContext();

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

  const handleIgnore = useMemoizedFn((msg: IgnoreMessage) => {
    if (msg.type === 'aurorian' && msg.aurorianId) {
      form.setFieldValue('enableExclude', true);
      const prevExcludeArray = form.getFieldValue(
        'exclude',
      ) as QueryParamsType['exclude'];
      if (Array.isArray(prevExcludeArray)) {
        const target = prevExcludeArray.find(
          t => t.aurorianId === msg.aurorianId,
        );
        if (!target) {
          if (prevExcludeArray.length === 1 && isEmpty(prevExcludeArray[0])) {
            prevExcludeArray.pop();
          }
          if (msg.breakthrough) {
            form.setFieldValue('exclude', [
              ...prevExcludeArray,
              {
                aurorianId: msg.aurorianId,
                excludeBreakthroughOnly: true,
                excludeBreakthrough: msg.breakthrough,
              } as ExcludeDataType,
            ]);
          } else {
            form.setFieldValue('exclude', [
              ...prevExcludeArray,
              { aurorianId: msg.aurorianId } as ExcludeDataType,
            ]);
          }
          form.submit();
        } else {
          notification.error({
            message: `这个光灵已经在排除列表中了 ❤`,
          });
        }
      }
    } else if (msg.type === 'copilot') {
      const copilotsIgnoreArray = form.getFieldValue('copilotsIgnore');
      if (Array.isArray(copilotsIgnoreArray)) {
        form.setFieldValue('copilotsIgnore', [
          ...copilotsIgnoreArray,
          msg.copilotId,
        ]);
      } else {
        form.setFieldValue('copilotsIgnore', [msg.copilotId]);
      }
      form.submit();
    }
  });

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
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="准备好寻找作业了！"
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
              onIgnore={handleIgnore}
            />
          )}
        />
      </ConfigProvider>
    </>
  );
};

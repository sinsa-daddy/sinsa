import { useMemo, useRef, useState } from 'react';
import { Card, List } from 'antd';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import styles from './styles.module.less';
import { useCopilotSorter } from './CopilotSortContext';
import { CopilotSorter } from './CopilotSortContext/types';
import { CopilotBlock } from '@/components/SolutionCard/CopilotBlock';

const getRowKey = (c: CopilotNextType) => c.copilot_id;

interface CopilotListViewProps {
  currentTerm: TermNextType;
  dataSource: CopilotNextType[];
}

export const CopilotListView: React.FC<CopilotListViewProps> = ({
  currentTerm,
  dataSource,
}) => {
  const inViewRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const { sorter } = useCopilotSorter();

  const displayDataSource = useMemo(() => {
    switch (sorter) {
      case CopilotSorter.UploadTime:
        return dataSource;
      case CopilotSorter.Score:
        return Array.from(dataSource).sort((a, b) => b.score - a.score);
      case CopilotSorter.ReversedScore:
        return Array.from(dataSource).sort((a, b) => a.score - b.score);
      default:
        return dataSource;
    }
  }, [dataSource, sorter]);

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
      showTotal(total: number): string {
        return `总共 ${total} 条作业`;
      },
    };
  }, [current]);

  return (
    <>
      <div className={styles.Mount} ref={inViewRef} />
      <Card className={styles.CopilotCard}>
        <List<CopilotNextType>
          dataSource={displayDataSource}
          pagination={pagination}
          rowKey={getRowKey}
          renderItem={item => (
            <CopilotBlock
              className={styles.ControlledCopilotBlock}
              copilot={item}
              currentTerm={currentTerm}
              readOnly
            />
          )}
        />
      </Card>
    </>
  );
};

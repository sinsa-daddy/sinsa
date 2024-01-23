import type { CopilotType, TermType } from '@sinsa/schema';
import { useMemo, useRef, useState } from 'react';
import { Card, List } from 'antd';
import styles from './styles.module.less';
import { CopilotBlock } from '@/components/SolutionCard/CopilotBlock';

const getRowKey = (c: CopilotType) => c.bv;

interface CopilotListViewProps {
  currentTerm: TermType;
  dataSource: CopilotType[];
}

export const CopilotListView: React.FC<CopilotListViewProps> = ({
  currentTerm,
  dataSource,
}) => {
  const inViewRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

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
        <List<CopilotType>
          dataSource={dataSource}
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

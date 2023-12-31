import type { ProColumnType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { CopilotType, TermType } from '@sinsa/schema';
import { useCallback, useMemo } from 'react';
import { produce } from 'immer';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { Button } from 'antd';
import { useLocation } from '@modern-js/runtime/router';
import { copilotRowKey } from '../CopilotsTable';
import { getCopilotsColumns } from '../CopilotsTable/columns';

interface SolutionScenarioCardProps {
  solution: Solution;
  title?: string;
  currentTerm?: TermType;
  onIgnore?: (item: CopilotType) => void;
}

export const SolutionScenarioCard: React.FC<SolutionScenarioCardProps> = ({
  solution,
  title,
  currentTerm,
  onIgnore,
}) => {
  const request = useCallback(async () => {
    return {
      data: produce(solution.copilots, draft => {
        draft.sort((a, b) => Number(b.score - a.score));
      }),
      success: true,
    };
  }, []);

  const toolbar = useMemo(() => ({ title, settings: [] }), [title]);

  const scroll = useMemo(() => ({ x: 'max-content' }), []);

  const location = useLocation();

  const columns = useMemo(
    () =>
      location.search.includes('feature=ignore')
        ? [
            ...getCopilotsColumns({ currentTerm }),
            {
              title: '操作',
              valueType: 'option',
              key: 'option',
              width: 80,
              render: (_, record) => [
                <Button
                  size="small"
                  key="ignore"
                  onClick={e => {
                    e.stopPropagation();
                    onIgnore?.(record);
                  }}
                >
                  忽略
                </Button>,
              ],
            } as ProColumnType<CopilotType>,
          ]
        : getCopilotsColumns({ currentTerm }),
    [currentTerm?.term],
  );

  return (
    <ProTable<CopilotType>
      showHeader={true}
      toolbar={toolbar}
      rowKey={copilotRowKey}
      columns={columns}
      request={request}
      search={false}
      pagination={false}
      scroll={scroll}
      ghost
    />
  );
};

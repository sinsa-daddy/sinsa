import { ProTable } from '@ant-design/pro-table';
import { CopilotType } from '@sinsa/schema';
import { useCallback, useMemo } from 'react';
import { produce } from 'immer';
import { copilotRowKey } from '../CopilotsTable';
import { copilotsColumns } from '../CopilotsTable/columns';
import type { SolutionScenario } from '@/features/backtrack/types';

interface SolutionScenarioCardProps {
  solution: SolutionScenario;
  title: string;
}

export const SolutionScenarioCard: React.FC<SolutionScenarioCardProps> = ({
  solution,
  title,
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

  return (
    <ProTable<CopilotType>
      toolbar={toolbar}
      rowKey={copilotRowKey}
      columns={copilotsColumns}
      request={request}
      search={false}
      pagination={false}
      size="small"
      scroll={scroll}
    />
  );
};

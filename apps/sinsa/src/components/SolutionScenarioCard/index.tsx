import { ProTable } from '@ant-design/pro-components';
import { CopilotType, TermType } from '@sinsa/schema';
import { useCallback, useMemo } from 'react';
import { produce } from 'immer';
import { copilotRowKey } from '../CopilotsTable';
import { getCopilotsColumns } from '../CopilotsTable/columns';
import type { SolutionScenario } from '@/features/backtrack/types';

interface SolutionScenarioCardProps {
  solution: SolutionScenario;
  title?: string;
  currentTerm?: TermType;
}

export const SolutionScenarioCard: React.FC<SolutionScenarioCardProps> = ({
  solution,
  title,
  currentTerm,
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

  const columns = useMemo(
    () => getCopilotsColumns({ currentTerm }),
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

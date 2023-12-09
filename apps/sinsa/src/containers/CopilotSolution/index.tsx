import { ProFormText, QueryFilter } from '@ant-design/pro-form';
import { CopilotType } from '@sinsa/schema';
import { Card } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { calculateAllScenariosAndScores } from '@/features/backtrack/calculate-all-scenarios-and-scores';
import { AuroriansModel } from '@/models/aurorians';
import { SolutionResult } from '@/features/backtrack/types';

interface CopilotSolutionProps {
  copilotsDataSource?: Record<CopilotType['bv'], CopilotType>;
}

export const CopilotSolution: React.FC<CopilotSolutionProps> = ({
  copilotsDataSource,
}) => {
  const copilots = useMemo(() => {
    return Object.values(copilotsDataSource ?? []);
  }, [copilotsDataSource]);
  const [{ WHOLE_BOX }] = useModel(AuroriansModel);
  const [solutionResult, setSolutionResult] = useState<SolutionResult>();

  return (
    <>
      <Card>
        <div>当期作业总数: {copilots.length}</div>
      </Card>
      <QueryFilter
        defaultCollapsed
        split
        onFinish={async () => {
          const result = calculateAllScenariosAndScores({
            copilots,
            availableBox: WHOLE_BOX.aurorian_summaries,
          });

          console.log('submit', result.scenarios);

          setSolutionResult(result);
        }}
      >
        <ProFormText
          name="test"
          label="输入框"
          placeholder="其实只是个占位的"
        />
        <ProFormText
          name="test2"
          label="输入框"
          placeholder="其实只是个占位的"
        />
      </QueryFilter>
      <Card>
        <pre>
          {JSON.stringify(
            solutionResult?.scenarios,
            (_, value) => {
              return typeof value === 'bigint' ? value.toString() : value;
            },
            2,
          )}
        </pre>
      </Card>
    </>
  );
};

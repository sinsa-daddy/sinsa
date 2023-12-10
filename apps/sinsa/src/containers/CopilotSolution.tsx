import { ProFormDigit, ProFormText, QueryFilter } from '@ant-design/pro-form';
import { CopilotType } from '@sinsa/schema';
import { Card } from 'antd';
import { useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { calculateAllScenariosAndScores } from '@/features/backtrack/calculate-all-scenarios-and-scores';
import { AuroriansModel } from '@/models/aurorians';
import { SolutionResult } from '@/features/backtrack/types';

interface CopilotSolutionProps {
  dataSource: CopilotType[];
}

export const CopilotSolution: React.FC<CopilotSolutionProps> = ({
  dataSource,
}) => {
  const [{ WHOLE_BOX }] = useModel(AuroriansModel);
  const [solutionResult, setSolutionResult] = useState<SolutionResult>();

  return (
    <>
      <QueryFilter
        defaultCollapsed
        onFinish={async (params: unknown) => {
          console.log('params', params);
          const result = calculateAllScenariosAndScores({
            copilots: dataSource,
            availableBox: WHOLE_BOX.aurorian_summaries,
          });

          setSolutionResult(result);
        }}
        searchText="计算"
        initialValues={{ range: 3 }}
      >
        <ProFormDigit
          fieldProps={{ min: 2, max: 4 }}
          name="range"
          label="队伍数量"
          rules={[{ required: true }]}
          placeholder={'可查找 2-4 队'}
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

import { ProFormRadio, QueryFilter } from '@ant-design/pro-form';
import { CopilotType } from '@sinsa/schema';
import { Card, List, Typography } from 'antd';
import { useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import numeral from 'numeral';
import { calculateAllScenariosAndScores } from '@/features/backtrack/calculate-all-scenarios-and-scores';
import { AuroriansModel } from '@/models/aurorians';
import { SolutionResult } from '@/features/backtrack/types';
import { SolutionScenarioCard } from '@/components/SolutionScenarioCard';

interface CopilotSolutionProps {
  dataSource: CopilotType[];
}

interface QueryParams {
  k: number;
  box: 'whole' | 'my-box';
}

export const CopilotSolution: React.FC<CopilotSolutionProps> = ({
  dataSource,
}) => {
  const [{ WHOLE_BOX }] = useModel(AuroriansModel);
  const [solutionResult, setSolutionResult] = useState<SolutionResult>();

  return (
    <>
      <Typography.Title level={3}>寻找队伍方案</Typography.Title>
      <QueryFilter<QueryParams>
        defaultCollapsed
        onFinish={async params => {
          const result = calculateAllScenariosAndScores(
            {
              copilots: dataSource,
              availableBox: WHOLE_BOX.aurorian_summaries,
            },
            params.k,
          );

          setSolutionResult(result);
        }}
        searchText="寻找队伍方案"
        initialValues={{ k: 2, box: 'whole' }}
      >
        <ProFormRadio.Group
          name="k"
          label="队伍数量"
          rules={[{ required: true }]}
          options={[
            { label: '两支队伍', value: 2 },
            { label: '三支队伍', value: 3 },
            { label: '四支队伍', value: 4 },
          ]}
          allowClear={false}
          radioType="button"
        />
        <ProFormRadio.Group
          name="box"
          label="Box 匹配"
          options={[
            { label: '全图鉴满突破 Box', value: 'whole' },
            { label: '我的自定义 Box', value: 'my-box', disabled: true },
          ]}
          allowClear={false}
          radioType="button"
          rules={[{ required: true }]}
        />
      </QueryFilter>
      <Card>
        <List
          dataSource={solutionResult?.scenarios}
          pagination={{ pageSize: 5 }}
          rowKey={sc => sc.copilots.map(c => c.bv).join('')}
          renderItem={(item, index) => {
            return (
              <SolutionScenarioCard
                key={item.copilots.map(c => c.bv).join('')}
                solution={item}
                title={`#${index + 1} 方案: ${numeral(item.totalScore).format(
                  '0,0',
                )} 分`}
              />
            );
          }}
        />
      </Card>
    </>
  );
};

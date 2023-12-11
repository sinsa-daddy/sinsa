import {
  ProForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { CopilotType } from '@sinsa/schema';
import { Divider, List, Typography, message } from 'antd';
import { useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import numeral from 'numeral';
import { produce } from 'immer';
import { calculateAllScenariosAndScores } from '@/features/backtrack/calculate-all-scenarios-and-scores';
import { AuroriansModel } from '@/models/aurorians';
import { SolutionResult } from '@/features/backtrack/types';
import { SolutionScenarioCard } from '@/components/SolutionScenarioCard';
import { ExcludeAurorianFormList } from '@/components/ExcludeAurorianFormList';

interface CopilotSolutionProps {
  dataSource: CopilotType[];
}

interface QueryParams {
  k: number;
  box: 'whole' | 'my-box';
  disalbeAlternative?: boolean;
  enableExclude?: boolean;
  exclude?: {
    aurorianName: string;
    excludeBreakthrough?: number;
    excludeBreakthroughOnly?: boolean;
  }[];
}

export const CopilotSolution: React.FC<CopilotSolutionProps> = ({
  dataSource,
}) => {
  const [{ WHOLE_BOX }] = useModel(AuroriansModel);
  const [solutionResult, setSolutionResult] = useState<SolutionResult>();

  return (
    <>
      <Typography.Title level={3}>寻找队伍方案</Typography.Title>
      <ProForm<QueryParams>
        onFinish={async params => {
          let filterBox = WHOLE_BOX.aurorian_summaries;
          if (params.exclude) {
            filterBox = produce(WHOLE_BOX.aurorian_summaries, draft => {
              for (const aurorianInExclude of params.exclude!) {
                if (!aurorianInExclude.excludeBreakthroughOnly) {
                  delete draft[aurorianInExclude.aurorianName];
                } else if (
                  typeof aurorianInExclude.excludeBreakthrough === 'number' &&
                  aurorianInExclude.excludeBreakthrough >= 1
                ) {
                  draft[aurorianInExclude.aurorianName].breakthrough =
                    aurorianInExclude.excludeBreakthrough - 1;
                }
              }
            });
          }

          const result = calculateAllScenariosAndScores(
            {
              copilots: dataSource,
              availableBox: filterBox,
            },
            params.k,
            { disalbeAlternative: params.disalbeAlternative },
          );

          if (result.scenarios?.length) {
            message.success(
              `已为您找到 ${result?.scenarios?.length} 个队伍方案，总分数由高至低排列`,
            );
          }

          setSolutionResult(result);
        }}
        // sub="寻找队伍方案"
        initialValues={{ k: 3, box: 'whole' }}
        layout="vertical"
        submitter={{ searchConfig: { submitText: '寻找队伍方案' } }}
      >
        <ProForm.Group>
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
          <ProFormSwitch
            name={'disalbeAlternative'}
            label="不考虑可替自由位"
            tooltip="开启后，计算的队伍方案中绝对不会出现重复光灵，满足图鉴大佬的强迫症"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch name="enableExclude" label="额外排除光灵" />
          <ProFormDependency name={['enableExclude']}>
            {({ enableExclude }) => {
              if (enableExclude) {
                return <ExcludeAurorianFormList name={'exclude'} />;
              }
              return null;
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ProForm>
      <Divider />
      <List
        dataSource={solutionResult?.scenarios}
        pagination={{ align: 'center' }}
        rowKey={sc => sc.copilots.map(c => c.bv).join('')}
        renderItem={item => {
          return (
            <div
              key={item.copilots.map(c => c.bv).join('')}
              style={{ marginBottom: '1rem' }}
            >
              <SolutionScenarioCard
                solution={item}
                title={`方案: ${numeral(item.totalScore).format('0,0')} 分`}
              />
            </div>
          );
        }}
      />
    </>
  );
};

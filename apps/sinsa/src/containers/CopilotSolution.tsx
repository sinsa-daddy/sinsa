import {
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormRadio,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { CopilotType } from '@sinsa/schema';
import { Card, List, Space, Typography } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import numeral from 'numeral';
import { produce } from 'immer';
import { useRequest } from 'ahooks';
import { useRef, useState } from 'react';
import { calculateAllScenariosAndScores } from '@/features/backtrack/calculate-all-scenarios-and-scores';
import { AuroriansModel } from '@/models/aurorians';
import { SolutionScenarioCard } from '@/components/SolutionScenarioCard';
import { ExcludeAurorianFormList } from '@/components/ExcludeAurorianFormList';
import type { SolutionScenario } from '@/features/backtrack/types';

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

const initialValues = { k: 3, box: 'whole', exclude: [{}] as any[] } as const;

export const CopilotSolution: React.FC<CopilotSolutionProps> = ({
  dataSource,
}) => {
  const [{ WHOLE_BOX }] = useModel(AuroriansModel);

  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState(1);
  const inViewRef = useRef<HTMLDivElement>(null);

  const { data, loading, runAsync } = useRequest(
    async (params: QueryParams) => {
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

      const [solutionResult] = await Promise.all([
        Promise.resolve(
          calculateAllScenariosAndScores(
            {
              copilots: dataSource,
              availableBox: filterBox,
            },
            params.k,
            { disalbeAlternative: params.disalbeAlternative },
          ),
        ),
        new Promise<void>(resolve => window.setTimeout(resolve, 100)),
      ]);

      const rankSet = new WeakMap<SolutionScenario, number>();
      for (let i = 0; i < solutionResult.scenarios.length; i++) {
        const target = solutionResult.scenarios[i];
        rankSet.set(target, i);
      }

      gtag('event', 'get_solution_result', {
        k: params.k,
        box: params.box,
        disalbeAlternative: params.disalbeAlternative,
        enableExclude: params.enableExclude,
        solutions_length: solutionResult.scenarios.length,
        exclude: params.exclude
          ?.map(
            xclude =>
              `${xclude.aurorianName}_${
                (xclude.excludeBreakthroughOnly &&
                  xclude.excludeBreakthrough) ||
                ''
              }`,
          )
          .join(','),
      });

      return {
        solutionResult,
        rankSet,
      };
    },
    {
      manual: true,
      defaultParams: [initialValues],
    },
  );

  return (
    <>
      <Card style={{ marginBottom: '1rem' }}>
        <ProForm<QueryParams>
          formRef={formRef}
          onFinish={async params => {
            await runAsync(params);
            setCurrent(1);
          }}
          // sub="寻找队伍方案"
          initialValues={initialValues}
          layout="vertical"
          submitter={{
            // render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            searchConfig: { submitText: '寻找匹配方案' },
            render(_, dom) {
              return (
                <Space wrap>
                  {dom}
                  {data?.solutionResult ? (
                    <Typography.Text>
                      已为您找到{' '}
                      <Typography.Text strong>
                        {data?.solutionResult.scenarios.length}
                      </Typography.Text>{' '}
                      个匹配方案
                    </Typography.Text>
                  ) : null}
                </Space>
              );
            },
          }}
          loading={loading}
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
              extra="自定义 Box 匹配暂不支持，无法选中，敬请期待w"
            />
            <ProFormSwitch
              name={'disalbeAlternative'}
              label="不考虑可替自由位"
              tooltip="开启后，计算的队伍方案中绝对不会出现重复光灵，满足图鉴大佬的强迫症"
            />
            <ProForm.Group>
              <ProFormSwitch
                name="enableExclude"
                label="额外排除光灵"
                tooltip="排除光灵会忽略可替自由位"
              />
              <ProFormDependency name={['enableExclude']}>
                {({ enableExclude }) => {
                  if (enableExclude) {
                    return <ExcludeAurorianFormList name={'exclude'} />;
                  }
                  return null;
                }}
              </ProFormDependency>
            </ProForm.Group>
          </ProForm.Group>
        </ProForm>
      </Card>
      <div ref={inViewRef} />
      <List
        loading={loading}
        dataSource={data?.solutionResult?.scenarios}
        pagination={{
          align: 'center',
          defaultPageSize: 5,
          current,
          onChange(page) {
            setCurrent(page);
            window.scrollTo({
              top: inViewRef.current!.offsetTop,
              behavior: 'smooth',
            });
          },
          showSizeChanger: false,
        }}
        rowKey={sc => sc.copilots.map(c => c.bv).join('')}
        renderItem={item => {
          return (
            <Card
              title={
                <>
                  {data?.rankSet
                    ? `#${(data.rankSet.get(item) ?? 0) + 1} 匹配方案 `
                    : null}
                  {numeral(item.totalScore).format('0,0')}
                </>
              }
              key={item.copilots.map(c => c.bv).join('')}
              style={{ marginBottom: '1rem' }}
            >
              <SolutionScenarioCard solution={item} />
            </Card>
          );
        }}
      />
    </>
  );
};

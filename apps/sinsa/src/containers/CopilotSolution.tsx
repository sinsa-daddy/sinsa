import {
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormRadio,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { CopilotType, TermType } from '@sinsa/schema';
import { Card, List, Space, Typography } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import numeral from 'numeral';
import { produce } from 'immer';
import { useLocalStorageState, useRequest } from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import { useLocation } from '@modern-js/runtime/router';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { AuroriansModel } from '@/models/aurorians';
import { SolutionScenarioCard } from '@/components/SolutionScenarioCard';
import { ExcludeAurorianFormList } from '@/components/ExcludeAurorianFormList';
import { calculateAllSolutionsAsync } from '@/features/backtrack/calculate-scenarios-async';

interface CopilotSolutionProps {
  dataSource: CopilotType[];
  currentTerm: TermType;
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
  enableSaveLocalStorage?: boolean;
}

const initialValues = { k: 3, box: 'whole', exclude: [{}] as any[] } as const;

const BASE_TEAM_COUNT = [
  { label: '两队', value: 2 },
  { label: '三队', value: 3 },
  { label: '四队', value: 4 },
];

const EXTENDED_TEAM_COUNT = [{ label: '一队', value: 1 }, ...BASE_TEAM_COUNT];

export const CopilotSolution: React.FC<CopilotSolutionProps> = ({
  dataSource,
  currentTerm,
}) => {
  const [{ WHOLE_BOX }] = useModel(AuroriansModel);

  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState(1);
  const inViewRef = useRef<HTMLDivElement>(null);
  const LOCAL_STORAGE_SETTING_KEY = useMemo(
    () => `SINSA_DADDY_SOLUTIONS_FILTER_KEY_V1_${currentTerm.term}` as const,
    [currentTerm.term],
  );

  const [localSetting, setLocalSetting] = useLocalStorageState(
    LOCAL_STORAGE_SETTING_KEY,
    {
      defaultValue: undefined,
    },
  );

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

      const allSolutions = await calculateAllSolutionsAsync(
        { copilots: dataSource, availableBox: filterBox },
        params.k,
        { disalbeAlternative: params.disalbeAlternative },
      );

      const rankSet = new WeakMap<Solution, number>();
      for (let i = 0; i < allSolutions.solutions.length; i++) {
        const target = allSolutions.solutions[i];
        rankSet.set(target, i);
      }

      gtag('event', 'get_solution_result', {
        k: params.k,
        box: params.box,
        disalbeAlternative: params.disalbeAlternative,
        enableExclude: params.enableExclude,
        solutions_length: allSolutions.solutions.length,
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
        allSolutions,
        rankSet,
      };
    },
    {
      manual: true,
      defaultParams: [initialValues],
    },
  );

  const location = useLocation();
  const COUNT = useMemo(() => {
    return location.search.includes('k1')
      ? EXTENDED_TEAM_COUNT
      : BASE_TEAM_COUNT;
  }, [location.search]);

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
          initialValues={localSetting ?? initialValues}
          layout="vertical"
          submitter={{
            // render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            searchConfig: { submitText: '寻找匹配方案' },
            render(_, dom) {
              return (
                <Space wrap>
                  {dom}
                  {data?.allSolutions ? (
                    <Typography.Text>
                      已为您找到{' '}
                      <Typography.Text strong>
                        {data?.allSolutions.solutions.length}
                      </Typography.Text>{' '}
                      个匹配方案
                    </Typography.Text>
                  ) : null}
                </Space>
              );
            },
          }}
          loading={loading}
          onValuesChange={(_, allValues) => {
            if (allValues.enableSaveLocalStorage) {
              const currentFormValues = formRef.current?.getFieldsValue();
              if (currentFormValues) {
                setLocalSetting(currentFormValues);
              }
            } else {
              setLocalSetting(undefined);
            }
          }}
        >
          <ProForm.Group>
            <ProFormRadio.Group
              name="k"
              label="队伍数量"
              rules={[{ required: true }]}
              options={COUNT}
              allowClear={false}
              radioType="button"
            />

            {/* <ProFormRadio.Group
              name="box"
              label="Box 匹配"
              options={[
                { label: '全图鉴满突破 Box', value: 'whole' },
                { label: '自定义 Box', value: 'my-box', disabled: true },
              ]}
              allowClear={false}
              radioType="button"
              rules={[{ required: true }]}
              extra="自定义 Box 匹配暂不支持，无法选中，敬请期待w"
            /> */}
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
            <ProFormSwitch
              name={'enableSaveLocalStorage'}
              label="记住我的设置"
              tooltip="开启后，这一期荒典筛选的设置将会储存在您的浏览器本地，避免繁琐重复筛选"
            />
          </ProForm.Group>
        </ProForm>
      </Card>
      <div ref={inViewRef} />
      <List
        loading={loading}
        dataSource={data?.allSolutions?.solutions}
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
              <SolutionScenarioCard solution={item} currentTerm={currentTerm} />
            </Card>
          );
        }}
      />
    </>
  );
};

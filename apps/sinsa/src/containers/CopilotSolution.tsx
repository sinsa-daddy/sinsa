/* eslint-disable max-lines */
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSwitch,
} from '@ant-design/pro-components';
import type { CopilotType, TermType } from '@sinsa/schema';
import {
  Card,
  ConfigProvider,
  Empty,
  List,
  Result,
  Space,
  Typography,
} from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { produce } from 'immer';
import {
  useLocalStorageState,
  useMemoizedFn,
  useRequest,
  useUpdateEffect,
} from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { isEmpty } from 'lodash-es';
import SINSA_SORRY from './assets/sorry.png';
import { AuroriansModel } from '@/models/aurorians';
import { ExcludeAurorianFormList } from '@/components/ExcludeAurorianFormList';
import { solutionAlgorithm } from '@/services/solution-algorithm';
import { SolutionCard } from '@/components/SolutionCard';
import type { IgnoreMessage } from '@/components/SolutionCard/types';

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

const EXTENDED_TEAM_COUNT = [
  { label: '一队', value: 1 },
  { label: '两队', value: 2 },
  { label: '三队', value: 3 },
  { label: '四队', value: 4 },
];

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

  const [copilotsIgnore, setCopilotsIgnore] = useState<CopilotType['bv'][]>(
    () => [],
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

      const allSolutions = await solutionAlgorithm.calculateAllSolutions(
        { copilots: dataSource, availableBox: filterBox },
        params.k,
        { disalbeAlternative: params.disalbeAlternative, copilotsIgnore },
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
      refreshDeps: [copilotsIgnore],
    },
  );

  useUpdateEffect(() => {
    formRef.current?.submit();
  }, [copilotsIgnore]);

  const handleIgnore = useMemoizedFn((msg: IgnoreMessage) => {
    if (!formRef.current) {
      return;
    }
    if (msg.aurorianName) {
      formRef.current.setFieldValue('enableExclude', true);
      const prevExcludeArray = formRef.current.getFieldValue(
        'exclude',
      ) as QueryParams['exclude'];
      if (Array.isArray(prevExcludeArray)) {
        const target = prevExcludeArray.find(
          t => t.aurorianName === msg.aurorianName,
        );
        if (!target) {
          if (prevExcludeArray.length === 1 && isEmpty(prevExcludeArray[0])) {
            prevExcludeArray.pop();
          }
          if (msg.breakthrough) {
            formRef.current.setFieldValue('exclude', [
              ...prevExcludeArray,
              {
                aurorianName: msg.aurorianName,
                excludeBreakthroughOnly: true,
                excludeBreakthrough: msg.breakthrough,
              },
            ]);
          } else {
            formRef.current.setFieldValue('exclude', [
              ...prevExcludeArray,
              { aurorianName: msg.aurorianName },
            ]);
          }
          formRef.current.submit();
        }
      }
    }
  });

  return (
    <>
      <Card style={{ marginBottom: '1rem' }}>
        <ProForm<QueryParams>
          formRef={formRef}
          onFinish={async params => {
            await runAsync(params);
            setCurrent(1);
          }}
          initialValues={localSetting ?? initialValues}
          layout="vertical"
          submitter={{
            // render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            onReset() {
              setCopilotsIgnore([]);
            },
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
                  {copilotsIgnore.length ? (
                    <Typography.Text>
                      已忽略{' '}
                      <Typography.Text strong>
                        {copilotsIgnore.length}
                      </Typography.Text>{' '}
                      个作业
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
              options={EXTENDED_TEAM_COUNT}
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
      <ConfigProvider
        renderEmpty={name => {
          if (name === 'List') {
            return data?.allSolutions?.solutions?.length === 0 ? (
              <Result
                icon={
                  <img width={100} src={SINSA_SORRY} alt="醒山daddy: 很抱歉" />
                }
                title="没能找到匹配的作业"
                subTitle={
                  <div>
                    <div>
                      1. 可以适当降低搜索的队伍数量。例如搜索两队 + 自己自动一队
                    </div>
                    <div>2. 当前作业数量较少。可等待作业站更新后再次搜索</div>
                  </div>
                }
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="准备好寻找作业了！"
              />
            );
          }
          return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }}
      >
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
              <SolutionCard
                index={data?.rankSet.get(item) ?? 0}
                solution={item}
                currentTerm={currentTerm}
                onIgnore={handleIgnore}
              />
            );
          }}
        />
      </ConfigProvider>
    </>
  );
};

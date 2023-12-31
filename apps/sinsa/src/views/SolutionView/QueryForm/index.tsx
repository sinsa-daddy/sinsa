import type { SubmitterProps } from '@ant-design/pro-components';
import {
  ProFormSelect,
  ProFormDependency,
  ProFormSwitch,
  ProFormRadio,
  ProForm,
} from '@ant-design/pro-components';
import { useCallback, useMemo } from 'react';
import { Typography } from 'antd';
import type { CopilotType } from '@sinsa/schema';
import type { QueryParamsType } from '../schemas/query-params';
import { useSolutionResultContext } from '../context';
import { useInitialValues } from './hooks/use-initial-values';
import { EXTENDED_TEAM_COUNT } from './constants';
import { ExcludeAurorianFormList } from '@/components/ExcludeAurorianFormList';

interface QueryFormProps {
  term: number;
  copilots: CopilotType[];
}

export const QueryForm: React.FC<QueryFormProps> = ({ term, copilots }) => {
  const { initialValues, setLocalInitialValues } = useInitialValues({ term });

  const { loadingSolutionResult, solutionResult, form, requestSolution } =
    useSolutionResultContext();

  const submitter = useMemo<SubmitterProps>(() => {
    return {
      searchConfig: { submitText: '寻找匹配方案' },
      render(_, dom) {
        const display = [...dom];
        if (typeof solutionResult?.allSolutions.solutions.length === 'number') {
          display.push(
            <Typography.Text key="count">
              已为您找到{' '}
              <Typography.Text strong>
                {solutionResult.allSolutions.solutions.length}
              </Typography.Text>{' '}
              个匹配方案
            </Typography.Text>,
          );
        }
        return display;
      },
    };
  }, [solutionResult?.allSolutions.solutions.length]);

  const handleValuesChange = useCallback(
    (_: unknown, allValues: QueryParamsType) => {
      if (allValues.enableSaveLocalStorage) {
        setLocalInitialValues(allValues);
      } else {
        setLocalInitialValues(undefined);
      }
      setLocalInitialValues(
        allValues.enableSaveLocalStorage ? allValues : undefined,
      );
    },
    [],
  );

  const ignoreOptions = useMemo(() => {
    return copilots.map(c => {
      return {
        label: `${c.author} ${Math.floor(c.score / 10000)}W`,
        value: c.bv,
      };
    });
  }, [copilots]);

  const handleOnFinish = useCallback(
    async (params: QueryParamsType) => {
      await requestSolution(copilots, params);
    },
    [copilots],
  );

  return (
    <ProForm<QueryParamsType>
      onFinish={handleOnFinish}
      layout="vertical"
      initialValues={initialValues}
      submitter={submitter}
      loading={loadingSolutionResult}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <ProForm.Group>
        <ProFormRadio.Group
          name={'k'}
          label="队伍数量"
          rules={[{ required: true }]}
          options={EXTENDED_TEAM_COUNT}
          allowClear={false}
          radioType="button"
        />
        <ProFormSwitch
          name={'disableAlternative'}
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
            {({ enableExclude }: Pick<QueryParamsType, 'enableExclude'>) => {
              return enableExclude ? (
                <ExcludeAurorianFormList name={'exclude'} />
              ) : null;
            }}
          </ProFormDependency>
        </ProForm.Group>
        <ProFormSwitch
          name={'enableSaveLocalStorage'}
          label="记住我的设置"
          tooltip="开启后，这一期荒典筛选的设置将会储存在您的浏览器本地，避免繁琐重复筛选"
        />
      </ProForm.Group>
      <ProFormDependency name={['copilotsIgnore']}>
        {({ copilotsIgnore }: Pick<QueryParamsType, 'copilotsIgnore'>) => {
          return copilotsIgnore?.length ? (
            <ProFormSelect
              mode="multiple"
              name={'copilotsIgnore'}
              label="已额外排除的作业"
              options={ignoreOptions}
            />
          ) : null;
        }}
      </ProFormDependency>
    </ProForm>
  );
};

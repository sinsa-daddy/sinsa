import type { SubmitterProps } from '@ant-design/pro-components';
import {
  ProFormSelect,
  ProFormDependency,
  ProFormSwitch,
  ProFormRadio,
  ProForm,
} from '@ant-design/pro-components';
import { useCallback, useMemo } from 'react';
import { Space, Typography } from 'antd';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { Search } from '@icon-park/react';
import ArmsRum from '@arms/rum-browser';
import { RumEventType } from '@arms/rum-core';
import type { QueryParamsType } from '../schemas/query-params';
import { useSolutionResultContext } from '../context';
import { useInitialValues } from './hooks/use-initial-values';
import { EXTENDED_TEAM_COUNT } from './constants';
import { ensureQueryKey } from './utils';
import { ExcludeAurorianFormList } from '@/components/ExcludeAurorianFormList';
import { RumArmsMyEvent, RumArmsMyType } from '@/plugins/arms';

interface QueryFormProps {
  termId: TermNextType['term_id'];
  copilots: CopilotNextType[];
}

export const QueryForm: React.FC<QueryFormProps> = ({ termId, copilots }) => {
  const { initialValues, setLocalInitialValues } = useInitialValues({ termId });

  const { loadingSolutionResult, solutionResult, form, requestSolution } =
    useSolutionResultContext();

  const submitter = useMemo<SubmitterProps>(() => {
    return {
      searchConfig: { submitText: '寻找方案' },
      submitButtonProps: {
        icon: <Search theme="outline" />,
      },
      render(_, dom) {
        const display = [...dom];
        if (typeof solutionResult?.allSolutions.solutions.length === 'number') {
          display.push(
            <Typography.Text key="count">
              已为您找到{' '}
              <Typography.Text strong>
                {solutionResult.allSolutions.solutions.length}
              </Typography.Text>{' '}
              个作业匹配方案
            </Typography.Text>,
          );
        }
        return <Space wrap>{display}</Space>;
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
        label: `${c.author_name} ${Math.floor(c.score / 10000)}W`,
        value: c.copilot_id,
      };
    });
  }, [copilots]);

  const handleOnFinish = useCallback(
    async (params: QueryParamsType) => {
      const start = Date.now();

      await requestSolution(copilots, params);

      ArmsRum.sendEvent({
        event_type: RumEventType.ACTION,
        type: RumArmsMyType.Query,
        name: RumArmsMyEvent.QuerySolution,
        k: params.k,
        snapshots: JSON.stringify(params),
        duration: Date.now() - start,
      });
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
          name={ensureQueryKey('k')}
          label="队伍数量"
          rules={[{ required: true }]}
          options={EXTENDED_TEAM_COUNT}
          allowClear={false}
          radioType="button"
        />
        <ProFormSwitch
          name={ensureQueryKey('disableAlternative')}
          label="不考虑可替自由位"
          tooltip="开启后，计算的队伍方案中绝对不会出现重复光灵，满足图鉴大佬的强迫症"
        />
        <ProForm.Group>
          <ProFormSwitch
            name={ensureQueryKey('enableExclude')}
            label="额外排除光灵"
            tooltip="排除光灵会忽略可替自由位"
          />
          <ProFormDependency name={[ensureQueryKey('enableExclude')]}>
            {({ enableExclude }: Pick<QueryParamsType, 'enableExclude'>) => {
              return enableExclude ? (
                <ExcludeAurorianFormList name={ensureQueryKey('exclude')} />
              ) : null;
            }}
          </ProFormDependency>
        </ProForm.Group>
        <ProFormSwitch
          name={ensureQueryKey('enableSaveLocalStorage')}
          label="记住我的设置"
          tooltip="开启后，这一期荒典筛选的设置将会储存在您的浏览器本地，避免繁琐重复筛选"
        />
      </ProForm.Group>
      <ProFormDependency name={[ensureQueryKey('copilotsIgnore')]}>
        {({ copilotsIgnore }: Pick<QueryParamsType, 'copilotsIgnore'>) => {
          return copilotsIgnore?.length ? (
            <ProFormSelect
              mode="multiple"
              name={ensureQueryKey('copilotsIgnore')}
              label="已额外排除的作业"
              options={ignoreOptions}
            />
          ) : null;
        }}
      </ProFormDependency>
      {/* <ProFormDependency name={[ensureQueryKey('copilotsDiff')]}>
        {({ copilotsDiff }: Pick<QueryParamsType, 'copilotsDiff'>) => {
          console.log('copilotsDiff', copilotsDiff);
          return null;
        }}
      </ProFormDependency> */}
    </ProForm>
  );
};

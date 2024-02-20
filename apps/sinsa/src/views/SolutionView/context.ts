import constate from 'constate';
import { ProForm } from '@ant-design/pro-components';
import { useRequestSolution } from './hooks/use-request-solution';
import type { QueryParamsType } from './schemas/query-params';
import { useTriggerFormAction } from './hooks/use-trigger-form-action';

export const [SolutionResultProvider, useSolutionResultContext] = constate(
  () => {
    const { solutionResult, loadingSolutionResult, requestSolution } =
      useRequestSolution();

    const [form] = ProForm.useForm<QueryParamsType>();

    const { triggerFormAction } = useTriggerFormAction(form);

    return {
      solutionResult,
      loadingSolutionResult,
      requestSolution,
      form,
      triggerFormAction,
    };
  },
);

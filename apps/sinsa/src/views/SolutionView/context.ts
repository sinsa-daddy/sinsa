import constate from 'constate';
import { ProForm } from '@ant-design/pro-components';
import { useRequestSolution } from './hooks/use-request-solution';
import type { QueryParamsType } from './schemas/query-params';

export const [SolutionResultProvider, useSolutionResultContext] = constate(
  () => {
    const { solutionResult, loadingSolutionResult, requestSolution } =
      useRequestSolution();

    const [form] = ProForm.useForm<QueryParamsType>();

    return {
      solutionResult,
      loadingSolutionResult,
      requestSolution,
      form,
    };
  },
);

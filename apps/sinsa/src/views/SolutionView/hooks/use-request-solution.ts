import { useRequest } from 'ahooks';
import { useModel } from '@modern-js/runtime/model';
import type { CopilotType } from '@sinsa/schema';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import type { QueryParamsType } from '../schemas/query-params';
import { withoutExclude } from '../utils/without-exclude';
import { AuroriansModel } from '@/models/aurorians';
import { solutionAlgorithm } from '@/services/solution-algorithm';

export function useRequestSolution() {
  const [{ WHOLE_BOX, auroriansMap }] = useModel(AuroriansModel);
  const {
    data: solutionResult,
    loading: loadingSolutionResult,
    runAsync: requestSolution,
  } = useRequest(
    async (
      copilots: CopilotType[],
      {
        exclude,
        k,
        disableAlternative,
        copilotsIgnore,
        enableExclude,
      }: QueryParamsType,
    ) => {
      const availableBox =
        enableExclude && Array.isArray(exclude)
          ? withoutExclude(WHOLE_BOX.aurorian_summaries, exclude, auroriansMap)
          : WHOLE_BOX.aurorian_summaries;

      const allSolutions = await solutionAlgorithm.calculateAllSolutions(
        {
          copilots,
          availableBox,
        },
        k,
        { disableAlternative, copilotsIgnore },
      );

      const rankSet = new WeakMap<Solution, number>();
      for (let i = 0; i < allSolutions.solutions.length; i++) {
        const target = allSolutions.solutions[i];
        rankSet.set(target, i);
      }

      // gtag('event', 'get_solution_result', {
      //   k,
      //   disableAlternative,
      //   enableExclude,
      //   solutions_length: allSolutions.solutions.length,
      //   exclude: exclude
      //     ?.map(
      //       xclude =>
      //         `${xclude.aurorianName}_${
      //           (xclude.excludeBreakthroughOnly &&
      //             xclude.excludeBreakthrough) ||
      //           ''
      //         }`,
      //     )
      //     .join(','),
      // });

      return {
        allSolutions,
        rankSet,
      };
    },
    {
      manual: true,
    },
  );

  return {
    solutionResult,
    loadingSolutionResult,
    requestSolution,
  };
}

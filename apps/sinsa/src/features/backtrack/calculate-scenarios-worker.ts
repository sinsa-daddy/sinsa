import { calculateAllScenariosAndScores } from './calculate-all-scenarios-and-scores'; // 请替换为实际的文件路径
import type { SolutionResult } from './types';

self.addEventListener('message', event => {
  const { context, k, options } = event.data;
  const result: SolutionResult = calculateAllScenariosAndScores(
    context,
    k,
    options,
  );
  self.postMessage(result);
});

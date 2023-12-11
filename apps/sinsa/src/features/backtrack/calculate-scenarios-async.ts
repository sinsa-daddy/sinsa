import type { CalcOptions, SolutionContext, SolutionResult } from './types';

export async function calculateScenariosAsync(
  context: SolutionContext,
  k: number,
  options: CalcOptions,
): Promise<SolutionResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./calculate-scenarios-worker.ts');

    worker.addEventListener('message', event => {
      const result = event.data;
      resolve(result);
      worker.terminate();
    });

    worker.addEventListener('error', error => {
      reject(error);
      worker.terminate();
    });

    worker.postMessage({ context, k, options });
  });
}

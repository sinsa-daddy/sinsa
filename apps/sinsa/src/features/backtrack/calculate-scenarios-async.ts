import type {
  CalcOptions,
  SolutionContext,
  AllSolutions,
} from '@sinsa/solution-calculator/dist/types/types';

export async function calculateAllSolutionsAsync(
  context: SolutionContext,
  k: number,
  options: CalcOptions,
): Promise<AllSolutions> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('@sinsa/solution-calculator', import.meta.url),
    );

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

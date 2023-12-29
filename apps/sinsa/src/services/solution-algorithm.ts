import type {
  CalcOptions,
  SolutionContext,
  AllSolutions,
} from '@sinsa/solution-calculator/dist/types/types';

export class SolutionAlgorithmService {
  private static instance: SolutionAlgorithmService | null = null;

  public static getInstance(): SolutionAlgorithmService {
    if (SolutionAlgorithmService.instance === null) {
      SolutionAlgorithmService.instance = new SolutionAlgorithmService();
    }
    return SolutionAlgorithmService.instance;
  }

  protected constructor() {
    // noop
  }

  calculateAllSolutions(
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
}

export const solutionAlgorithm = SolutionAlgorithmService.getInstance();

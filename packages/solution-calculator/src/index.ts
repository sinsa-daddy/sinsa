import { calculateAllSolutions } from './lib/calculate-all-solutions';
import type { AllSolutions } from './types';

self.addEventListener('message', event => {
  const { context, k, options } = event.data;
  const result: AllSolutions = calculateAllSolutions(context, k, options);
  self.postMessage(result);
});

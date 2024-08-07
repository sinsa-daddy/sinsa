import type { CopilotNextType } from '@sinsa/schema';
import { REAL_RANDOM_RULES } from './real-random-rules';
import type { RealRandomMessage } from './real-random-rules';

export interface IsRealRandomResultType {
  stack: RealRandomMessage[];
  isRealRandomResult: boolean;
}

export class RealRandomService {
  private static instance: RealRandomService | null = null;

  public static getInstance(): RealRandomService {
    if (RealRandomService.instance === null) {
      RealRandomService.instance = new RealRandomService();
    }
    return RealRandomService.instance;
  }

  private cache: Map<CopilotNextType['copilot_id'], IsRealRandomResultType>;

  protected constructor() {
    this.cache = new Map();
  }

  isRealRandom(copilot: CopilotNextType): IsRealRandomResultType {
    const cacheResult = this.cache.get(copilot.copilot_id);
    if (cacheResult) {
      return cacheResult;
    }
    const result: RealRandomMessage[] = [];
    for (const fn of REAL_RANDOM_RULES) {
      const r = fn(copilot);
      if (r) {
        result.push(r);
      }
    }

    return {
      stack: result,
      isRealRandomResult: result.some(r => r.level === 'error'),
    };
  }
}

export const realRandomService = RealRandomService.getInstance();

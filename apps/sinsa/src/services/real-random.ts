import type { CopilotNextType } from '@sinsa/schema';

export interface IsRealRandomResultType {}

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
    return {};
  }
}

export const realRandomService = RealRandomService.getInstance();

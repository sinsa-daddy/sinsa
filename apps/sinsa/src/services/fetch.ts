import {
  AurorianType,
  CopilotType,
  TermSchema,
  type TermType,
} from '@sinsa/schema';

export class FetchService {
  private static instance: FetchService | null = null;

  public static getInstance(): FetchService {
    if (FetchService.instance === null) {
      FetchService.instance = new FetchService();
    }
    return FetchService.instance;
  }

  protected constructor() {
    // noop
  }

  /**
   * 获取荒典首领信息
   */
  async getTerms(): Promise<TermType[]> {
    const response = await fetch('/api/terms.json');
    const data: unknown = await response.json();
    return Array.isArray(data) ? data.map(item => TermSchema.parse(item)) : [];
  }

  /**
   * 获取光灵信息
   */
  async getAurorians(): Promise<
    Record<AurorianType['aurorian_name'], AurorianType>
  > {
    const response = await fetch('/api/aurorians.json');
    return await response.json();
  }

  /**
   * 获取作业
   */
  async getCopilots(
    term: number | `${number}`,
  ): Promise<Record<CopilotType['bv'], CopilotType>> {
    const response = await fetch(`/api/copilots/${term}.json`, {
      cache: 'no-cache',
    });
    return await response.json();
  }
}

export const http = FetchService.getInstance();

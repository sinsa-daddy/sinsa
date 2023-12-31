import { CopilotSchema, TermSchema } from '@sinsa/schema';
import type { AurorianType, CopilotType, TermType } from '@sinsa/schema';
import { isPlainObject, mapValues } from 'lodash-es';

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
    const data = await response.json();
    if (isPlainObject(data)) {
      return mapValues(data, v => CopilotSchema.parse(v));
    }
    return {};
  }
}

export const http = FetchService.getInstance();
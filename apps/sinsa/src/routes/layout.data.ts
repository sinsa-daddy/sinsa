import type { AurorianType, TermType } from '@sinsa/schema';
import { http } from '@/services/fetch';

export interface LayoutLoaderData {
  terms: TermType[];
  auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>;
}

export async function loader(): Promise<LayoutLoaderData> {
  const [terms, auroriansMap] = await Promise.all([
    http.getTerms(),
    http.getAurorians(),
  ]);
  return {
    terms,
    auroriansMap,
  };
}

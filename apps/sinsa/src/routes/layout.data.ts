import type { AurorianType, TermType } from '@sinsa/schema';
import { getAurorians, getTerms } from '@/services/http';

export interface LayoutLoaderData {
  terms: TermType[];
  auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>;
}

export async function loader(): Promise<LayoutLoaderData> {
  const [terms, auroriansMap] = await Promise.all([getTerms(), getAurorians()]);
  return {
    terms,
    auroriansMap,
  };
}

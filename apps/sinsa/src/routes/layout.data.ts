import type { AurorianNextType, TermNextType } from '@sinsa/schema';
import { getAurorians, getTerms } from '@/services/http';

export interface LayoutLoaderData {
  terms: TermNextType[];
  auroriansMap: Record<AurorianNextType['aurorian_id'], AurorianNextType>;
}

export async function loader(): Promise<LayoutLoaderData> {
  const [terms, auroriansMap] = await Promise.all([getTerms(), getAurorians()]);
  return {
    terms,
    auroriansMap,
  };
}

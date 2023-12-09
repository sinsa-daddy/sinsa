import type { AurorianType, TermType } from '@sinsa/schema';

export interface LayoutLoaderData {
  terms: TermType[];
  auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>;
}

export async function loader(): Promise<LayoutLoaderData> {
  const [terms, auroriansMap] = await Promise.all([
    fetch('/api/terms.json').then(response => response.json()),
    fetch('/api/aurorians.json').then(response => response.json()),
  ]);
  return {
    terms,
    auroriansMap,
  };
}

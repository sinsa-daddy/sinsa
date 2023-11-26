import type { TermType } from '@sinsa/schema';

export interface LayoutLoaderData {
  terms: TermType[];
}

export async function loader(): Promise<LayoutLoaderData> {
  const response = await fetch('/api/terms.json');
  const terms = await response.json();
  return {
    terms,
  };
}

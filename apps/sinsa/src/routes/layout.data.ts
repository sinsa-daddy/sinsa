import type { TableSummaryType } from '@sinsa/schema';

export interface LayoutLoaderData {
  terms: TableSummaryType[];
}

export async function loader(): Promise<LayoutLoaderData> {
  const response = await fetch('/api/terms.json');
  const terms = await response.json();
  return {
    terms,
  };
}

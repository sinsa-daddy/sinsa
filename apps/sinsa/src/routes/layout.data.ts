import type { TableSummaryType } from '@sinsa/schema';

export async function loader(): Promise<TableSummaryType[]> {
  const response = await fetch('/api/terms.json');
  return await response.json();
}

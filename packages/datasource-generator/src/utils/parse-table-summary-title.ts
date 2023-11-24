const TITLE_REGEXP = /^荒典(\d+)期?$/;

export function parseTableSummaryTitle(title: string) {
  const array = TITLE_REGEXP.exec(title);
  if (array?.[1]) {
    const result = Number.parseInt(array[1], 10);
    return Number.isInteger(result) ? result : null;
  }
  return null;
}

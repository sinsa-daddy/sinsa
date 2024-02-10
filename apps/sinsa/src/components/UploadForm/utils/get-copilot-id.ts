import type { FormValues } from '../types';

export function getCopilotId({
  href,
  aurorian_requirements,
  term_id,
}: Pick<FormValues, 'href' | 'aurorian_requirements' | 'term_id'>) {
  if (href && aurorian_requirements && term_id) {
    const url = new URL(`https://example.com/${href}`);
    return `${term_id}_${url.pathname.slice(1)}_${
      aurorian_requirements[0].aurorian_id
    }_${aurorian_requirements[4].aurorian_id}`;
  }
  return undefined;
}

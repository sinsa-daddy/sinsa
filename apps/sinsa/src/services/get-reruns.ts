import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { getCopilots } from './http';

export async function getRerunsCopilots(term: TermNextType) {
  let result: Record<CopilotNextType['copilot_id'], CopilotNextType> = {};
  const allCopilotsArray = await Promise.all(
    [term.term_id, ...(Array.isArray(term.reruns) ? term.reruns : [])].map(
      termId => getCopilots(termId),
    ),
  );

  for (const allCopilots of allCopilotsArray) {
    result = {
      ...result,
      ...allCopilots,
    };
  }

  return result;
}

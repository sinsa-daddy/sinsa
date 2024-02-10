import type { TermNextType } from '@sinsa/schema';
import { memoize } from 'lodash-es';

const NOW = Date.now();

export enum TermStatus {
  UNSTARTED = 'UNSTARTED',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}

export const getTermStatus = memoize(
  (term: TermNextType) => {
    if (NOW < term.start_time.valueOf()) {
      return TermStatus.UNSTARTED;
    }

    if (term.start_time.valueOf() < NOW && NOW < term.end_time.valueOf()) {
      return TermStatus.RUNNING;
    }

    if (term.end_time.valueOf() < NOW) {
      return TermStatus.FINISHED;
    }

    return undefined;
  },
  t => t.term_id,
);

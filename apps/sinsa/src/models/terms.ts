import { model } from '@modern-js/runtime/model';
import type { TermType } from '@sinsa/schema';
import { first } from 'lodash-es';

export interface TermsState {
  terms: TermType[];
}

const NOW = Date.now();

/**
 * 这期荒典是否正在进行中
 */
export function isCurrentlyUnderway(term: TermType) {
  return term.start_time.valueOf() < NOW && NOW < term.end_time.valueOf();
}

export const TermsModel = model<TermsState>('terms').define({
  state: {
    terms: [],
  },
  computed: {
    latestTerm: state => {
      return (
        state.terms.find(term => isCurrentlyUnderway(term)) ??
        first(state.terms)
      );
    },
    termsOptions: state =>
      state.terms.map(t => {
        return {
          label: `荒典第 ${t.term} 期`,
          value: t.term,
          extra: t,
        };
      }),
    termsMap: state => {
      const result: Record<TermType['term'], TermType> = {};
      for (const t of state.terms) {
        result[t.term] = t;
      }
      return result;
    },
  },
  actions: {},
});

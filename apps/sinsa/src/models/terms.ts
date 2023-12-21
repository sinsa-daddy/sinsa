import { model } from '@modern-js/runtime/model';
import type { TermType } from '@sinsa/schema';

export interface TermsState {
  terms: TermType[];
}

const NOW = Date.now();

export const TermsModel = model<TermsState>('terms').define({
  state: {
    terms: [],
  },
  computed: {
    currentTerm: state => {
      return state.terms.find(
        term =>
          term.start_time.valueOf() < NOW && NOW < term.end_time.valueOf(),
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

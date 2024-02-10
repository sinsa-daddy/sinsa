import { model } from '@modern-js/runtime/model';
import type { TermNextType } from '@sinsa/schema';
import { getLatestTerm } from './helpers/get-latest-term';

export interface TermsState {
  terms: TermNextType[];
}

export const TermsModel = model<TermsState>('terms').define({
  state: {
    terms: [],
  },
  computed: {
    latestTerm: state => getLatestTerm(state.terms),
    termsOptions: state =>
      state.terms.map(t => {
        return {
          label: `荒典第 ${t.order} 期`,
          value: t.term_id,
          extra: t,
        };
      }),
    termsMap: state => {
      const result: Record<TermNextType['term_id'], TermNextType> = {};
      for (const t of state.terms) {
        result[t.term_id] = t;
      }
      return result;
    },
  },
  actions: {},
});

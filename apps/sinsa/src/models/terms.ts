import { model } from '@modern-js/runtime/model';
import type { TermType } from '@sinsa/schema';
import { first } from 'lodash';

export interface TermsState {
  terms: TermType[];
}

export const TermsModel = model<TermsState>('terms').define({
  state: {
    terms: [],
  },
  computed: {
    firstTerm: state => first(state.terms),
    termsOptions: state =>
      state.terms.map(t => {
        return {
          label: `荒典第 ${t.term} 期`,
          value: t.term,
          extra: t,
        };
      }),
  },
  actions: {},
});

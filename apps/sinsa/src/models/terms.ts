import { model } from '@modern-js/runtime/model';
import { TableSummaryType } from '@sinsa/schema';
import { first } from 'lodash';

export interface TermsState {
  terms: TableSummaryType[];
}

export const TermsModel = model<TermsState>('terms').define({
  state: {
    terms: [],
  },
  computed: {
    firstTerm: state => first(state.terms),
  },
  actions: {},
});

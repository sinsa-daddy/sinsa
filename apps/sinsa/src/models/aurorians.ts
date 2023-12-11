import { model } from '@modern-js/runtime/model';
import type {
  AurorianSummaryType,
  AurorianType,
  MyBoxType,
} from '@sinsa/schema';
import { mapValues } from 'lodash-es';

export interface AuroriansState {
  auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>;
}

export const AuroriansModel = model<AuroriansState>('aurorians').define({
  state: {
    auroriansMap: {},
  },
  computed: {
    WHOLE_BOX: (state): MyBoxType => {
      return {
        title: '全图鉴',
        create_time: new Date(),
        version: 1,
        aurorian_summaries: mapValues(
          state.auroriansMap,
          ({ aurorian_name }) => {
            return {
              aurorian_name,
              breakthrough: Infinity, // 假设突破无穷大
            } as AurorianSummaryType;
          },
        ),
      };
    },
    auroriansOptions: state => {
      return Object.values(state.auroriansMap).map(a => {
        return {
          label: `${a.aurorian_cn_name} ${a.aurorian_name}`,
          value: a.aurorian_name,
          extra: a,
        };
      });
    },
  },
  actions: {},
});

import { model } from '@modern-js/runtime/model';
import type {
  AurorianAttributeType,
  AurorianSummaryType,
  AurorianType,
  MyBoxType,
} from '@sinsa/schema';
import { groupBy, mapValues } from 'lodash-es';
import { match } from 'pinyin-pro';
import React from 'react';
import { ElementTextMapper } from '@/components/AurorianCard/constants';

export interface AuroriansState {
  auroriansMap: Record<AurorianType['aurorian_name'], AurorianType>;
}

export interface AuroriansOption {
  label: React.ReactNode;
  options?: { label: string; value: string; options?: unknown[] }[];
}

export function filterAuroriansOption(
  inputValue: string,
  option?: AuroriansOption,
) {
  if (Array.isArray(option?.options)) {
    return false;
  }

  if (typeof option?.label === 'string') {
    return match(option?.label, inputValue, {
      precision: 'start',
    });
  }

  return false;
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
      return Object.entries(groupBy(state.auroriansMap, 'attribute')).map(
        ([attribute, aurorians]) => {
          return {
            label: ElementTextMapper[attribute as AurorianAttributeType],
            options: aurorians.map(a => {
              return {
                label: a.aurorian_cn_name,
                value: a.aurorian_name,
              };
            }),
          } as AuroriansOption;
        },
      );
    },
  },
  actions: {},
});

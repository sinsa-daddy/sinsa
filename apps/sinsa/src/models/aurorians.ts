import { model } from '@modern-js/runtime/model';
import type {
  AurorianAttributeType,
  AurorianNextType,
  AurorianRequirementType,
} from '@sinsa/schema';
import { groupBy, mapValues } from 'lodash-es';
import { match } from 'pinyin-pro';
import type React from 'react';
import { ElementTextMapper } from '@/components/AurorianCard/constants';

export interface AuroriansState {
  auroriansMap: Record<AurorianNextType['aurorian_id'], AurorianNextType>;
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
    WHOLE_BOX: (
      state,
    ): Record<
      AurorianRequirementType['aurorian_id'],
      AurorianRequirementType
    > => {
      return mapValues(state.auroriansMap, ({ aurorian_id }) => {
        return {
          aurorian_id,
          breakthrough: Infinity, // 假设突破无穷大
        } as AurorianRequirementType;
      });
    },
    auroriansOptions: state => {
      return Object.entries(groupBy(state.auroriansMap, 'primary_element')).map(
        ([attribute, aurorians]) => {
          return {
            label: ElementTextMapper[attribute as AurorianAttributeType],
            options: aurorians.map(a => {
              return {
                label: a.cn_name,
                value: a.aurorian_id,
              };
            }),
          } as AuroriansOption;
        },
      );
    },
  },
  actions: {},
});

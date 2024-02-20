import type { ProFormInstance } from '@ant-design/pro-components';
import { useCallback } from 'react';
import type { AurorianNextType, CopilotNextType } from '@sinsa/schema';
import type {
  ExcludeDataType,
  QueryParamsType,
} from '../../schemas/query-params';
import { ensureQueryKey } from '../../QueryForm/utils';
import { getNormalizeBreakthroughByRarity } from '../../utils/without-exclude';
import { QueryFormAction } from './constants';

export type TriggerFormActionPayload =
  | {
      type: QueryFormAction.IgnoreAurorian;
      aurorian: AurorianNextType;
    }
  | {
      type: QueryFormAction.IgnoreAurorianBreakthroughOnly;
      aurorian: AurorianNextType;
      breakthrough: number;
    }
  | {
      type: QueryFormAction.IgnoreCopilot;
      copilot: CopilotNextType;
    }
  | {
      type: QueryFormAction.ReplaceAurorian;
      aurorian: AurorianNextType;
      copilot: CopilotNextType;
    };

export function useTriggerFormAction(form: ProFormInstance<QueryParamsType>) {
  const triggerFormAction = useCallback(
    (payload: TriggerFormActionPayload) => {
      switch (payload.type) {
        // 1. 排除单个作业
        case QueryFormAction.IgnoreCopilot: {
          const copilotsIgnore = form.getFieldValue(
            ensureQueryKey('copilotsIgnore'),
          );
          const newCopilotsIgnore = Array.isArray(copilotsIgnore)
            ? [...copilotsIgnore, payload.copilot.copilot_id]
            : [payload.copilot.copilot_id];
          form.setFieldValue(
            ensureQueryKey('copilotsIgnore'),
            newCopilotsIgnore,
          );
          break;
        }

        // 2. 排除单个光灵
        case QueryFormAction.IgnoreAurorian:
        case QueryFormAction.IgnoreAurorianBreakthroughOnly: {
          form.setFieldValue(ensureQueryKey('enableExclude'), true);
          const { exclude } = form.getFieldsValue();
          // 光灵是否已经在排除列表里了
          const existAurorianInfo = exclude?.find(
            ex => ex.aurorianId === payload.aurorian.aurorian_id,
          );
          let clonedExclude = Array.isArray(exclude) ? Array.from(exclude) : [];
          if (existAurorianInfo) {
            clonedExclude = clonedExclude.filter(
              info => info.aurorianId !== existAurorianInfo.aurorianId,
            );
          }
          const newExclude: ExcludeDataType[] =
            payload.type === QueryFormAction.IgnoreAurorianBreakthroughOnly
              ? [
                  ...clonedExclude,
                  {
                    aurorianId: payload.aurorian.aurorian_id,
                    excludeBreakthroughOnly: true,
                    excludeBreakthrough: getNormalizeBreakthroughByRarity(
                      payload.breakthrough,
                      payload.aurorian.rarity,
                    ),
                  },
                ]
              : [
                  ...clonedExclude,
                  { aurorianId: payload.aurorian.aurorian_id },
                ];
          form.setFieldValue(ensureQueryKey('exclude'), newExclude);

          break;
        }

        default:
          break;
      }
      window.setTimeout(() => form.submit());
    },
    [form],
  );

  return {
    triggerFormAction,
  };
}

import { useModel } from '@modern-js/runtime/model';
import type { AurorianNextType, AurorianRequirementType } from '@sinsa/schema';
import { useEffect, useMemo } from 'react';
import { Form, InputNumber, Radio, Rate, Result, Slider } from 'antd';
import { produce } from 'immer';
import { SmilingFace } from '@icon-park/react';
import styles from './styles.module.less';
import { AuroriansModel } from '@/models/aurorians';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';
import { getDefaultBreakthrough } from '@/components/UploadForm/CopilotSelector/utils/getDefaultBreakthrough';
import { getDefaultTooltips } from '@/components/UploadForm/AurorianTallCard/utils/getDefaultBreakthrough';
import {
  LEVEL_MARKS,
  RFN_OPTIONS,
} from '@/components/UploadForm/AurorianTallCard/constants';

interface AurorianSelectorDetailProps {
  activeArurorianId: string | null;
  value: Record<
    AurorianNextType['aurorian_id'],
    AurorianRequirementType | undefined
  >;
  onChange: React.Dispatch<
    React.SetStateAction<Record<string, AurorianRequirementType | undefined>>
  >;
}

export const AurorianSelectorDetail: React.FC<AurorianSelectorDetailProps> = ({
  value,
  onChange,
  activeArurorianId,
}) => {
  const [{ auroriansMap }] = useModel(AuroriansModel);
  const aurorian = useMemo(
    () =>
      typeof activeArurorianId === 'string'
        ? auroriansMap[activeArurorianId]
        : undefined,
    [auroriansMap, activeArurorianId],
  );

  const targetRequire =
    (activeArurorianId && value[activeArurorianId]) ||
    ({
      aurorian_id: activeArurorianId,
      breakthrough: aurorian ? getDefaultBreakthrough(aurorian.rarity) : 0,
    } as AurorianRequirementType);

  useEffect(() => {
    if (activeArurorianId && aurorian?.rarity) {
      const target = value[activeArurorianId];
      if (
        aurorian.rarity >= 4 &&
        Object.keys(target?.remark?.level ?? {}).length === 0
      ) {
        onChange({
          ...value,
          [activeArurorianId]: {
            ...targetRequire,
            remark: {
              level: {
                asc: 3,
                lv: 80,
                eq: 0,
                rfn: 0,
                aff: 0,
              },
            },
          },
        });
      } else {
        onChange({
          ...value,
          [activeArurorianId]: {
            ...targetRequire,
          },
        });
      }
    }
  }, [activeArurorianId, value, aurorian?.rarity]);

  if (!activeArurorianId) {
    return (
      <Result
        icon={<SmilingFace size={48} />}
        title="欢迎使用"
        subTitle="请从光灵列表中选择一个光灵以配置"
      />
    );
  }

  return aurorian ? (
    <div className={styles.Container}>
      <div className={styles.CardContainer}>
        <AdaptiveAurorianCard
          readOnly
          aurorianId={activeArurorianId}
          remark={targetRequire.remark}
          breakthrough={targetRequire.breakthrough}
        />
      </div>
      <Form>
        <Form.Item label="突破数">
          <Rate
            value={targetRequire.breakthrough}
            count={aurorian.rarity}
            onChange={newBk => {
              onChange?.({
                ...value,
                [activeArurorianId]: produce(targetRequire, draft => {
                  draft.breakthrough = newBk;
                }),
              });
            }}
            tooltips={getDefaultTooltips(aurorian.rarity)}
          />
        </Form.Item>
        {aurorian?.rarity && aurorian.rarity >= 4 ? (
          <Form.Item
            label="光灵等级"
            extra={
              <InputNumber
                prefix="Lv."
                className={styles.LvInput}
                value={targetRequire.remark?.level?.lv}
                min={1}
                max={80}
                onChange={newLv => {
                  onChange?.({
                    ...value,
                    [activeArurorianId]: {
                      ...targetRequire,
                      remark: produce(targetRequire.remark ?? {}, draft => {
                        if (draft.level && typeof newLv === 'number') {
                          draft.level.lv = newLv;
                          if (newLv < 80) {
                            draft.level.rfn = 0;
                          }
                        }
                      }),
                    },
                  });
                }}
              />
            }
          >
            <Slider
              value={targetRequire.remark?.level?.lv}
              min={1}
              max={80}
              marks={LEVEL_MARKS}
              onChange={newLv => {
                onChange?.({
                  ...value,
                  [activeArurorianId]: {
                    ...targetRequire,
                    remark: produce(targetRequire.remark ?? {}, draft => {
                      if (draft.level) {
                        draft.level.lv = newLv;
                        if (newLv < 80) {
                          draft.level.rfn = 0;
                        }
                      }
                    }),
                  },
                });
              }}
              step={null}
            />
          </Form.Item>
        ) : null}
        {targetRequire.remark?.level?.lv === 80 ? (
          <Form.Item label="装备精炼">
            <Radio.Group
              optionType="button"
              value={targetRequire.remark?.level?.rfn ?? 0}
              options={RFN_OPTIONS}
              onChange={e => {
                onChange?.({
                  ...value,
                  [activeArurorianId]: {
                    ...targetRequire,
                    remark: produce(targetRequire.remark ?? {}, draft => {
                      if (draft.level) {
                        draft.level.rfn = e.target.value;
                      }
                    }),
                  },
                });
              }}
            />
          </Form.Item>
        ) : null}
      </Form>
    </div>
  ) : (
    <div>未找到 {activeArurorianId} 的光灵</div>
  );
};

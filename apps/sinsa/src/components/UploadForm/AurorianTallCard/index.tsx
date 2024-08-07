import type React from 'react';
import { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Flex, InputNumber, Radio, Rate, Slider, Space, Switch } from 'antd';
import type {
  AurorianNextType,
  AurorianRequirementRemarkType,
} from '@sinsa/schema';
import { produce } from 'immer';
import styles from './styles.module.less';
import { getDefaultTooltips } from './utils/getDefaultBreakthrough';
import { normalizeRemark } from './utils/normalizeRemark';
import { ASC_OPTIONS, LEVEL_MARKS, RFN_OPTIONS } from './constants';
import { AuroriansModel } from '@/models/aurorians';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

interface AurorianTallCardProps {
  id: string;
  breakthrough?: number;
  remark?: AurorianRequirementRemarkType;
  onBreakthroughChange?: (b: number) => void;
  onRemarkChange?: (r: AurorianRequirementRemarkType | undefined) => void;
}

const REPLCE_OPTIONS = [
  { label: '可替', value: 'All' },
  { label: '可替输出', value: 'DPS' },
  { label: '可替位移', value: 'TP' },
];

export const AurorianTallCard: React.FC<AurorianTallCardProps> = ({
  id: name,
  breakthrough,
  remark,
  onBreakthroughChange,
  onRemarkChange,
}) => {
  const [{ auroriansMap }] = useModel(AuroriansModel);
  const aurorian = useMemo(
    () => auroriansMap[name] as AurorianNextType | undefined,
    [auroriansMap, name],
  );

  const hasLevel = Object.keys(remark?.level ?? {}).length > 0;
  return (
    <Flex vertical align="center" gap={8}>
      <div className={styles.AdaptiveContainer}>
        <AdaptiveAurorianCard
          readOnly
          aurorianId={name}
          remark={remark}
          breakthrough={breakthrough}
        />
      </div>

      {typeof breakthrough === 'number' && aurorian?.rarity ? (
        <Rate
          className={styles.BreakThrough}
          value={breakthrough}
          count={aurorian.rarity}
          onChange={onBreakthroughChange}
          tooltips={getDefaultTooltips(aurorian.rarity)}
        />
      ) : null}
      <Flex align="center" gap={2} wrap={'wrap'}>
        <Switch
          checkedChildren="可替换"
          unCheckedChildren="不可替换"
          checked={remark?.replace?.type === 'any'}
          onChange={val => {
            onRemarkChange?.(
              normalizeRemark(
                produce(remark ?? {}, draft => {
                  if (val) {
                    draft.replace = {
                      type: 'any',
                      any: 'All',
                    };
                  } else {
                    delete draft.replace;
                  }
                }),
              ),
            );
          }}
        />
        {remark?.replace?.type === 'any' ? (
          <Radio.Group
            size="small"
            value={remark?.replace?.any}
            options={REPLCE_OPTIONS}
            optionType="button"
            onChange={e => {
              onRemarkChange?.(
                normalizeRemark(
                  produce(remark ?? {}, draft => {
                    if (draft.replace?.type === 'any') {
                      draft.replace.any = e.target.value;
                    }
                  }),
                ),
              );
            }}
          />
        ) : null}
      </Flex>
      {typeof aurorian?.rarity === 'number' && aurorian.rarity >= 4 ? (
        <Flex align="center" gap={6} wrap={'wrap'} vertical={true}>
          <Switch
            checkedChildren="标注练度"
            unCheckedChildren="不标注练度"
            checked={hasLevel}
            onChange={val => {
              onRemarkChange?.(
                normalizeRemark(
                  produce(remark ?? {}, draft => {
                    if (val) {
                      draft.level = {
                        asc: 3,
                        lv: 80,
                        eq: 0,
                        rfn: 0,
                        aff: 0,
                      };
                    } else {
                      delete draft.level;
                    }
                  }),
                ),
              );
            }}
          />
          {hasLevel ? (
            <Flex align="center" gap={2} wrap={'wrap'} vertical={true}>
              <Radio.Group
                size="small"
                optionType="button"
                disabled
                value={remark?.level?.asc ?? 0}
                options={ASC_OPTIONS}
              />
              <Space>
                <Slider
                  style={{ width: 180 }}
                  value={remark?.level?.lv ?? 0}
                  min={1}
                  max={80}
                  marks={LEVEL_MARKS}
                  onChange={val => {
                    onRemarkChange?.(
                      normalizeRemark(
                        produce(remark ?? {}, draft => {
                          if (draft.level) {
                            draft.level.lv = val;
                            if (val < 80) {
                              draft.level.rfn = 0;
                            }
                          }
                        }),
                      ),
                    );
                  }}
                  step={null}
                />
                <InputNumber
                  style={{ width: 60 }}
                  size="small"
                  value={remark?.level?.lv ?? 0}
                  min={1}
                  max={80}
                  onChange={val => {
                    onRemarkChange?.(
                      normalizeRemark(
                        produce(remark ?? {}, draft => {
                          if (draft.level) {
                            draft.level.lv = val ?? 0;
                          }
                        }),
                      ),
                    );
                  }}
                />
              </Space>
              {remark?.level?.lv === 80 ? (
                <Radio.Group
                  size="small"
                  optionType="button"
                  value={remark?.level?.rfn ?? 0}
                  options={RFN_OPTIONS}
                  onChange={val => {
                    onRemarkChange?.(
                      normalizeRemark(
                        produce(remark ?? {}, draft => {
                          if (draft.level) {
                            draft.level.rfn = val.target.value;
                          }
                        }),
                      ),
                    );
                  }}
                />
              ) : null}
            </Flex>
          ) : null}
        </Flex>
      ) : null}
    </Flex>
  );
};

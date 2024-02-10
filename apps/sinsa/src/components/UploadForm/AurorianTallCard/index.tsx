import React, { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Flex, Rate, Switch } from 'antd';
import type {
  AurorianNextType,
  AurorianRequirementRemarkType,
} from '@sinsa/schema';
import { produce } from 'immer';
import styles from './styles.module.less';
import { getDefaultTooltips } from './utils/getDefaultBreakthrough';
import { normalizeRemark } from './utils/normalizeRemark';
import { AuroriansModel } from '@/models/aurorians';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

interface AurorianTallCardProps {
  id: string;
  breakthrough?: number;
  remark?: AurorianRequirementRemarkType;
  onBreakthroughChange?: (b: number) => void;
  onRemarkChange?: (r: AurorianRequirementRemarkType | undefined) => void;
}

export const AurorianTallCard = React.memo<AurorianTallCardProps>(
  ({
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

    return (
      <Flex vertical align="center" gap={8}>
        <div className={styles.AdaptiveContainer}>
          <AdaptiveAurorianCard readOnly aurorianId={name} remark={remark} />
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
        <Switch
          checkedChildren="可替换"
          unCheckedChildren="不可替换"
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
      </Flex>
    );
  },
);

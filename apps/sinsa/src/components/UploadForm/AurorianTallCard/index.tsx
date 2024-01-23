import React, { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { type AurorianType } from '@sinsa/schema';
import { Flex, Rate, Switch } from 'antd';
import { RarityMapper } from '../../AurorianCard/constants';
import styles from './styles.module.less';
import { getDefaultTooltips } from './utils/getDefaultBreakthrough';
import { AuroriansModel } from '@/models/aurorians';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

interface AurorianTallCardProps {
  name: string;
  breakthrough?: number;
  isReplaceable?: boolean;
  onBreakthroughChange?: (b: number) => void;
  onReplaceableChange?: (r: boolean) => void;
}

export const AurorianTallCard = React.memo<AurorianTallCardProps>(
  ({
    name,
    breakthrough,
    isReplaceable,
    onBreakthroughChange,
    onReplaceableChange,
  }) => {
    const [{ auroriansMap }] = useModel(AuroriansModel);
    const aurorian = useMemo(
      () => auroriansMap[name] as AurorianType | undefined,
      [auroriansMap, name],
    );

    return (
      <Flex vertical align="center" gap={8}>
        <div className={styles.AdaptiveContainer}>
          <AdaptiveAurorianCard
            readOnly
            name={name}
            isReplaceable={isReplaceable}
          />
        </div>

        {typeof breakthrough === 'number' && aurorian?.rarity ? (
          <Rate
            className={styles.BreakThrough}
            value={breakthrough}
            count={RarityMapper[aurorian.rarity]}
            onChange={onBreakthroughChange}
            tooltips={getDefaultTooltips(aurorian.rarity)}
          />
        ) : null}
        <Switch
          checkedChildren="可替换"
          unCheckedChildren="不可替换"
          onChange={onReplaceableChange}
        />
      </Flex>
    );
  },
);

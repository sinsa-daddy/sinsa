import React, { useEffect, useMemo, useRef } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { type AurorianType } from '@sinsa/schema';
import { ConfigProvider, Rate } from 'antd';
import {
  ClassURLMapper,
  ElementURLMapper,
  RarityMapper,
} from '../AurorianCard/constants';
import styles from './styles.module.less';
import { AuroriansModel } from '@/models/aurorians';

interface AurorianBoxCardProps {
  name: string;
  breakthrough: number;
  onBreakthroughChange?: (breakthrough: number) => void;
}

export const AurorianBoxCard = React.memo<AurorianBoxCardProps>(
  ({ name, breakthrough, onBreakthroughChange }) => {
    const [{ auroriansMap }] = useModel(AuroriansModel);
    const aurorian = useMemo(
      () => auroriansMap[name] as AurorianType | undefined,
      [auroriansMap, name],
    );

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (aurorian?.aurorian_name) {
        import(`@/assets/skins/${aurorian.aurorian_name}.webp`)
          .then(esm => {
            if (typeof esm?.default === 'string') {
              if (cardRef.current) {
                cardRef.current.style.backgroundImage = `url(${esm.default})`;
              }
            }
          })
          .catch(() => {
            // ignore
          });
      }
    }, [aurorian?.aurorian_name]);

    return (
      <div className={styles.AurorianBoxCard} ref={cardRef}>
        {aurorian?.class && aurorian?.attribute ? (
          <div className={styles.MetaContainer}>
            <img
              className={styles.MetaClass}
              alt={aurorian.class}
              src={ClassURLMapper[aurorian.class]}
            />
            <div className={styles.MetaAttributeContainer}>
              <img
                className={styles.MetaFirstAttribute}
                alt={aurorian.attribute}
                src={ElementURLMapper[aurorian.attribute]}
              />
              {aurorian.secondary_attribute ? (
                <img
                  className={styles.MetaSecondAttribute}
                  alt={aurorian.secondary_attribute}
                  src={ElementURLMapper[aurorian.secondary_attribute]}
                />
              ) : null}
            </div>
          </div>
        ) : null}
        <div className={styles.NameContainer}>
          <div title={aurorian?.aurorian_name}>
            {aurorian?.aurorian_cn_name}
          </div>

          {aurorian?.rarity ? (
            <ConfigProvider
              theme={{
                components: {
                  Rate: {
                    starBg: 'white',
                    starSize: 16,
                  },
                },
              }}
            >
              <Rate
                className={styles.BreakThrough}
                value={breakthrough}
                count={RarityMapper[aurorian.rarity]}
                onChange={t => {
                  onBreakthroughChange?.(t);
                }}
              />
            </ConfigProvider>
          ) : null}
        </div>
      </div>
    );
  },
);

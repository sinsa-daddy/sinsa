import React, { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import type { AurorianType } from '@sinsa/schema';
import clsx from 'clsx';
import { ConfigProvider, Flex, Rate, Tag } from 'antd';
import { useBreakpoint } from '@ant-design/pro-components';
import styles from './styles.module.less';
import { useLazyImage } from './hooks/use-lazy-image';
import { ClassURLMapper, ElementURLMapper, RarityMapper } from './constants';
import { AuroriansModel } from '@/models/aurorians';

interface AdaptiveArurorianCardProps {
  name: string;
  breakthrough?: number;
  isReplaceable?: boolean;
}

export const AdaptiveAurorianCard = React.memo<AdaptiveArurorianCardProps>(
  ({ name, breakthrough, isReplaceable }) => {
    const [{ auroriansMap }] = useModel(AuroriansModel);
    const aurorian = useMemo(
      () => auroriansMap[name] as AurorianType | undefined,
      [auroriansMap, name],
    );
    const { containerRef } = useLazyImage(aurorian?.aurorian_name);

    const screen = useBreakpoint();
    const rateTheme = useMemo(() => {
      let starSize = 10;
      switch (screen) {
        case 'xs':
          starSize = 10;
          break;
        case 'sm':
          starSize = 12;
          break;
        default:
          starSize = 13;
          break;
      }
      return {
        components: {
          Rate: {
            starBg: 'white',
            starSize,
          },
        },
      };
    }, [screen]);

    return (
      <Flex
        vertical
        ref={containerRef}
        className={clsx(styles.AdaptiveAurorianCard, styles.BackgroundImage)}
        align="center"
        gap={2}
      >
        {aurorian ? (
          <>
            <Flex vertical className={styles.NameContainer}>
              <span>{aurorian?.aurorian_cn_name}</span>
              {typeof breakthrough === 'number' && aurorian?.rarity ? (
                <ConfigProvider theme={rateTheme}>
                  <Rate
                    className={styles.BreakThrough}
                    disabled
                    value={breakthrough}
                    count={RarityMapper[aurorian.rarity]}
                  />
                </ConfigProvider>
              ) : null}
            </Flex>
            <Flex className={styles.MetaContainer}>
              <img
                className={styles.MetaClass}
                alt={aurorian.class}
                src={ClassURLMapper[aurorian.class]}
              />
              <Flex align="center">
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
              </Flex>
            </Flex>
          </>
        ) : null}
        {isReplaceable ? (
          <Tag className={styles.ReplaceableTag} color={'#dc5950'}>
            可替
          </Tag>
        ) : null}
      </Flex>
    );
  },
);

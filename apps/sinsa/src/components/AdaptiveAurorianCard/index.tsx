import React, { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import type { AurorianType } from '@sinsa/schema';
import clsx from 'clsx';
import type { MenuProps } from 'antd';
import { ConfigProvider, Flex, Rate, Tag, Dropdown } from 'antd';
import { useBreakpoint } from '@ant-design/pro-components';
import { m } from 'framer-motion';
import type { IgnoreMessage } from '../types';
import styles from './styles.module.less';
import { useLazyImage } from './hooks/use-lazy-image';
import { ClassURLMapper, ElementURLMapper, RarityMapper } from './constants';
import { AuroriansModel } from '@/models/aurorians';
import { getNormalizeBreakthroughByRarity } from '@/views/SolutionView/utils/without-exclude';

interface AdaptiveArurorianCardProps {
  name: string;
  breakthrough?: number;
  isReplaceable?: boolean;
  onIgnore?: (msg: IgnoreMessage) => void;
  readOnly?: boolean;
}

export const AdaptiveAurorianCard = React.memo<AdaptiveArurorianCardProps>(
  ({ name, breakthrough, isReplaceable, onIgnore, readOnly }) => {
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

    const items: MenuProps['items'] = [
      {
        label: `排除${aurorian?.aurorian_cn_name}`,
        key: 'ignore',
      },
      {
        label: `仅排除此突破数的${aurorian?.aurorian_cn_name}`,
        key: 'ignore-breakthrough',
      },
    ];

    return (
      <Dropdown
        disabled={readOnly}
        trigger={['click']}
        getPopupContainer={() => document.body}
        menu={{
          items,
          onClick: ({ key }) => {
            console.log('key', key);
            if (!aurorian?.aurorian_name) {
              return;
            }
            switch (key) {
              case 'ignore-breakthrough':
                onIgnore?.({
                  type: 'aurorian',
                  aurorianName: aurorian.aurorian_name,
                  breakthrough: getNormalizeBreakthroughByRarity(
                    breakthrough ?? 0,
                    aurorian.rarity,
                  ),
                });
                break;
              case 'ignore':
                onIgnore?.({
                  type: 'aurorian',
                  aurorianName: aurorian.aurorian_name,
                });
                break;
              default:
                break;
            }
          },
        }}
      >
        <m.div
          ref={containerRef}
          className={clsx(
            styles.AdaptiveAurorianCard,
            styles.BackgroundImage,
            readOnly && styles.Disabled,
          )}
          whileHover={readOnly ? undefined : { opacity: 0.6 }}
          whileTap={readOnly ? undefined : { opacity: 0.2 }}
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
        </m.div>
      </Dropdown>
    );
  },
);

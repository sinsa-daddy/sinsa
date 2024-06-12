/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { useModel } from '@modern-js/runtime/model';
import type {
  AurorianRequirementRemarkType,
  AurorianNextType,
} from '@sinsa/schema';
import clsx from 'clsx';
import type { MenuProps } from 'antd';
import { ConfigProvider, Flex, Rate, Tag, Dropdown } from 'antd';
import { useBreakpoint } from '@ant-design/pro-components';
import { m } from 'framer-motion';
import styles from './styles.module.less';
import { useLazyImage } from './hooks/use-lazy-image';
import {
  AdaptiveAurorianCardMenuKey,
  ClassURLMapper,
  ElementURLMapper,
  RefineTextMapper,
} from './constants';
import { IconAsc } from './components/asc';
import { AuroriansModel } from '@/models/aurorians';
import { useSolutionResultContext } from '@/views/SolutionView/context';
import { QueryFormAction } from '@/views/SolutionView/hooks/use-trigger-form-action/constants';
import { GLOBAL_THEME } from '@/globalTheme';

interface AdaptiveArurorianCardProps {
  aurorianId: string;
  breakthrough?: number;
  remark?: AurorianRequirementRemarkType;
  readOnly?: boolean;
  mini?: boolean;
  onReplace?: (aurorian: AurorianNextType) => void;
  hideMeta?: boolean;
}

export const AdaptiveAurorianCard = React.memo<AdaptiveArurorianCardProps>(
  ({
    aurorianId: name,
    breakthrough,
    remark,
    readOnly,
    mini,
    onReplace,
    hideMeta,
  }) => {
    const [{ auroriansMap }] = useModel(AuroriansModel);
    const aurorian = useMemo(
      () => auroriansMap[name] as AurorianNextType | undefined,
      [auroriansMap, name],
    );
    const { containerRef } = useLazyImage(aurorian?.aurorian_id);

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

    const items: MenuProps['items'] = useMemo(
      () =>
        [
          {
            label: `排除${aurorian?.cn_name}`,
            key: AdaptiveAurorianCardMenuKey.IgnoreAurorian,
          },
          typeof breakthrough === 'number'
            ? {
                label: `仅排除此突破数的${aurorian?.cn_name}`,
                key: AdaptiveAurorianCardMenuKey.IgnoreBreakthrough,
              }
            : null,
          // {
          //   label: `替换${aurorian?.cn_name}`,
          //   key: AdaptiveAurorianCardMenuKey.ReplaceAurorian,
          // },
        ].filter(_ => _),
      [aurorian?.cn_name, breakthrough],
    );

    const { triggerFormAction } = useSolutionResultContext();

    // 是否包含装备精炼
    const hasRefinement =
      remark?.level?.lv === 80 &&
      typeof remark?.level?.rfn === 'number' &&
      remark?.level?.rfn > 0;

    return (
      <Dropdown
        disabled={readOnly}
        trigger={['click']}
        getPopupContainer={() => document.body}
        menu={{
          items,
          onClick: ({ key }) => {
            if (!aurorian?.aurorian_id) {
              return;
            }

            switch (key) {
              case AdaptiveAurorianCardMenuKey.IgnoreBreakthrough:
                if (typeof breakthrough === 'number') {
                  triggerFormAction({
                    type: QueryFormAction.IgnoreAurorianBreakthroughOnly,
                    aurorian,
                    breakthrough,
                  });
                }

                break;
              case AdaptiveAurorianCardMenuKey.IgnoreAurorian:
                triggerFormAction({
                  type: QueryFormAction.IgnoreAurorian,
                  aurorian,
                });
                break;

              case AdaptiveAurorianCardMenuKey.ReplaceAurorian:
                onReplace?.(aurorian);
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
            mini ? styles.MiniSize : styles.LargeSize,
          )}
          whileHover={readOnly ? undefined : { opacity: 0.6 }}
          whileTap={readOnly ? undefined : { opacity: 0.2 }}
        >
          {aurorian ? (
            <>
              <Flex vertical className={styles.NameContainer}>
                <span>{aurorian?.cn_name}</span>
                {typeof breakthrough === 'number' && aurorian?.rarity ? (
                  <ConfigProvider theme={rateTheme}>
                    <Rate
                      className={styles.BreakThrough}
                      disabled
                      value={breakthrough}
                      count={aurorian.rarity}
                    />
                  </ConfigProvider>
                ) : null}
              </Flex>
              {hideMeta ? null : (
                <Flex align="center" className={styles.MetaContainer}>
                  <img
                    className={styles.MetaClass}
                    alt={aurorian.profession}
                    src={ClassURLMapper[aurorian.profession]}
                  />
                  <Flex align="center" vertical={mini}>
                    <img
                      className={styles.MetaFirstAttribute}
                      alt={aurorian.primary_element}
                      src={ElementURLMapper[aurorian.primary_element]}
                    />
                    {aurorian.secondary_element ? (
                      <img
                        className={styles.MetaSecondAttribute}
                        alt={aurorian.secondary_element}
                        src={ElementURLMapper[aurorian.secondary_element]}
                      />
                    ) : null}
                  </Flex>
                </Flex>
              )}
            </>
          ) : null}
          {remark?.replace?.type === 'any' && remark?.replace?.any === 'All' ? (
            <Tag
              className={styles.ReplaceableTag}
              color={GLOBAL_THEME.primaryColor}
            >
              可替
            </Tag>
          ) : null}
          {remark?.replace?.type === 'any' && remark?.replace?.any === 'DPS' ? (
            <Tag
              className={styles.ReplaceableTag}
              color={GLOBAL_THEME.primaryColor}
            >
              可替输出
            </Tag>
          ) : null}
          {remark?.replace?.type === 'any' && remark?.replace?.any === 'TP' ? (
            <Tag
              className={styles.ReplaceableTag}
              color={GLOBAL_THEME.primaryColor}
            >
              可替位移
            </Tag>
          ) : null}
          {remark?.replace?.type === 'any' &&
          remark?.replace?.any === 'Heal' ? (
            <Tag
              className={styles.ReplaceableTag}
              color={GLOBAL_THEME.primaryColor}
            >
              可替治疗
            </Tag>
          ) : null}
          {remark?.replace?.type === 'any' ? null : aurorian?.rarity &&
            remark?.level?.asc === 3 &&
            typeof remark?.level?.lv === 'number' ? (
            <Tag className={styles.RemarkContainer} color={'rgba(0,0,0,0.4)'}>
              <Flex align="center" gap={2}>
                <IconAsc rairty={aurorian.rarity} asc={3} />
                <span
                  className={clsx(
                    styles.num,
                    hasRefinement && styles.refineText,
                  )}
                >
                  {remark?.level?.lv}
                </span>
                {hasRefinement ? (
                  <span className={styles.refine}>
                    {RefineTextMapper[remark?.level?.rfn as 1 | 2 | 3]}
                  </span>
                ) : null}
              </Flex>
            </Tag>
          ) : null}
        </m.div>
      </Dropdown>
    );
  },
);

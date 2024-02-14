import type { TermNextType } from '@sinsa/schema';
import { Card, Flex } from 'antd';
import React, { useMemo } from 'react';
import { RelativeTimeText } from '../RelativeTimeText';
import { ElementURLMapper } from '../AdaptiveAurorianCard/constants';
import styles from './styles.module.less';
import { REVERSED_MATCH_UP } from '@/services/matchup';

export interface BossCardProps {
  term: TermNextType;
}

export const BossCard = React.memo<BossCardProps>(
  ({ term }) => {
    const { boss_name, features, end_time, boss_element } = term;

    const reversedMatchedElement = useMemo(() => {
      return REVERSED_MATCH_UP[boss_element];
    }, [boss_element]);

    return (
      <Card className={styles.Card}>
        <Flex vertical={true} gap={4}>
          <Flex align="center" gap={4} wrap="nowrap">
            <span className={styles.BossName}>{boss_name}</span>
            <img
              className={styles.MetaFirstAttribute}
              alt={boss_element}
              src={ElementURLMapper[boss_element]}
            />
          </Flex>
          <span className={styles.EndTimeContainer}>
            <RelativeTimeText time={end_time} />
            结束
          </span>
          <ul className={styles.FeaturesContainer}>
            <li key={'matchup'}>
              <img
                className={styles.FeatureElement}
                alt={reversedMatchedElement}
                src={ElementURLMapper[reversedMatchedElement]}
              />{' '}
              属性有利
            </li>
            {features.split('\n').map(text => {
              return <li key={text}>{text}</li>;
            })}
          </ul>
        </Flex>
      </Card>
    );
  },
  (a, b) => a.term.term_id === b.term.term_id,
);

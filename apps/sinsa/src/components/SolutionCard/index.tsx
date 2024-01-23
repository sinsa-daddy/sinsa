import type { CopilotType, TermType } from '@sinsa/schema';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { Card, Typography } from 'antd';
import React, { useMemo } from 'react';
import { isEqual } from 'lodash-es';
import numeral from 'numeral';
import type { IgnoreMessage } from '../types';
import { CopilotBlock } from './CopilotBlock';
import styles from './styles.module.less';

const copilotRowKey = (c: CopilotType) => c.bv;

export interface SolutionCardProps {
  solution: Solution;
  currentTerm: TermType;
  index: number;
  onIgnore?: (msg: IgnoreMessage) => void;
}

export const SolutionCard = React.memo<SolutionCardProps>(
  ({ solution, currentTerm, index, onIgnore }) => {
    const sorted = useMemo(() => {
      return [...solution.copilots].sort((a, b) => b.score - a.score);
    }, [solution]);
    return (
      <Card className={styles.SolutionCard} bodyStyle={{ paddingBottom: 16 }}>
        <div className={styles.TotalScore}>
          <Typography.Text strong>{`#${index + 1} 匹配方案 ${numeral(
            solution.totalScore,
          ).format('0,0')}`}</Typography.Text>
        </div>

        {sorted.map(copilot => {
          return (
            <CopilotBlock
              className={styles.ControlledCopilotBlock}
              key={copilotRowKey(copilot)}
              copilot={copilot}
              currentTerm={currentTerm}
              onIgnore={onIgnore}
            />
          );
        })}
      </Card>
    );
  },
  (prev, next) =>
    isEqual(
      prev.solution.copilots.map(c => c.bv),
      next.solution.copilots.map(c => c.bv),
    ) &&
    prev.currentTerm.term === next.currentTerm.term &&
    prev.index === next.index,
);

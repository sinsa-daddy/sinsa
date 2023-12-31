import type { TermType } from '@sinsa/schema';
import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { Card, Statistic } from 'antd';
import React, { useMemo } from 'react';
import { isEqual } from 'lodash-es';
import { copilotRowKey } from '../CopilotsTable';
import { CopilotBlock } from './CopilotBlock';
import styles from './styles.module.less';

export interface SolutionCardProps {
  solution: Solution;
  currentTerm: TermType;
  index: number;
}

export const SolutionCard = React.memo<SolutionCardProps>(
  ({ solution, currentTerm, index }) => {
    const sorted = useMemo(() => {
      return [...solution.copilots].sort((a, b) => b.score - a.score);
    }, [solution]);
    return (
      <Card className={styles.SolutionCard}>
        <Statistic
          title={`#${index + 1} 匹配方案`}
          value={solution.totalScore}
        />
        {sorted.map(copilot => {
          return (
            <CopilotBlock
              className={styles.ControlledCopilotBlock}
              key={copilotRowKey(copilot)}
              copilot={copilot}
              currentTerm={currentTerm}
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

import type { Solution } from '@sinsa/solution-calculator/dist/types/types';
import { Card, Typography } from 'antd';
import React, { useMemo } from 'react';
import { isEqual } from 'lodash-es';
import numeral from 'numeral';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { CopilotBlock } from './CopilotBlock';
import styles from './styles.module.less';
import { getSolutionTitle } from './helpers';

const copilotRowKey = (c: CopilotNextType) => c.copilot_id;

export interface SolutionCardProps {
  solution: Solution;
  currentTerm: TermNextType;
  index: number;
}

export const SolutionCard = React.memo<SolutionCardProps>(
  ({ solution, currentTerm, index }) => {
    const sorted = useMemo(() => {
      return [...solution.copilots].sort((a, b) => b.score - a.score);
    }, [solution]);

    return (
      <Card className={styles.SolutionCard} bodyStyle={{ paddingBottom: 16 }}>
        <div className={styles.TotalScore}>
          <Typography.Text strong>{`#${index + 1} ${getSolutionTitle(
            solution.copilots.length,
          )} ${numeral(solution.totalScore).format('0,0')}`}</Typography.Text>
        </div>

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
      prev.solution.copilots.map(c => c.copilot_id),
      next.solution.copilots.map(c => c.copilot_id),
    ) &&
    prev.currentTerm.term_id === next.currentTerm.term_id &&
    prev.index === next.index,
);

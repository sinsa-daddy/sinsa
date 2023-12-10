import type { CopilotType } from '@sinsa/schema';
import React from 'react';
import { AurorianCard } from '../AurorianCard';
import styles from './styles.module.less';

interface AuroriansTeamProps {
  aurorianSummaries: CopilotType['aurorian_summaries'];
}

export const AuroriansTeam: React.FC<AuroriansTeamProps> = ({
  aurorianSummaries,
}) => {
  return (
    <div className={styles.AuroriansTeam}>
      {aurorianSummaries.map(
        ({ aurorian_name, breakthrough, is_replaceable }) => {
          return (
            <AurorianCard
              key={aurorian_name}
              name={aurorian_name}
              breakthrough={breakthrough}
              isReplaceable={is_replaceable}
            />
          );
        },
      )}
    </div>
  );
};

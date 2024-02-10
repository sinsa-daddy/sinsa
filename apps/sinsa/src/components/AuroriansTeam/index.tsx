import type { CopilotNextType } from '@sinsa/schema';
import type React from 'react';
import { AurorianCard } from '../AurorianCard';
import styles from './styles.module.less';

interface AuroriansTeamProps {
  aurorianSummaries: CopilotNextType['aurorian_requirements'];
}

export const AuroriansTeam: React.FC<AuroriansTeamProps> = ({
  aurorianSummaries,
}) => {
  return (
    <div className={styles.AuroriansTeam}>
      {aurorianSummaries.map(({ aurorian_id, breakthrough, remark }) => {
        return (
          <AurorianCard
            key={aurorian_id}
            name={aurorian_id}
            breakthrough={breakthrough}
            remark={remark}
          />
        );
      })}
    </div>
  );
};

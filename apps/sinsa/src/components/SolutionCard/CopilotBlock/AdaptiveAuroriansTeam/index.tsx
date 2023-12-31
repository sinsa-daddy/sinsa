import type { CopilotType } from '@sinsa/schema';
import type React from 'react';
import { Flex } from 'antd';
import styles from './styles.module.less';
import { AdaptiveAurorianCard } from './AdaptiveAurorianCard';

interface AdaptiveAuroriansTeamProps {
  aurorianSummaries: CopilotType['aurorian_summaries'];
}

export const AdaptiveAuroriansTeam: React.FC<AdaptiveAuroriansTeamProps> = ({
  aurorianSummaries,
}) => {
  return (
    <Flex className={styles.AuroriansTeam}>
      {aurorianSummaries.map(
        ({ aurorian_name, breakthrough, is_replaceable }) => {
          return (
            <AdaptiveAurorianCard
              key={aurorian_name}
              name={aurorian_name}
              breakthrough={breakthrough}
              isReplaceable={is_replaceable}
            />
          );
        },
      )}
    </Flex>
  );
};

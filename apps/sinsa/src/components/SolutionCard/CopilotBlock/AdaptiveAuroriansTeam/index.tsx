import type { CopilotType } from '@sinsa/schema';
import type React from 'react';
import { Flex } from 'antd';
import type { IgnoreMessage } from '../../../types';
import styles from './styles.module.less';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

interface AdaptiveAuroriansTeamProps {
  aurorianSummaries: CopilotType['aurorian_summaries'];
  onIgnore?: (msg: IgnoreMessage) => void;
  readOnly?: boolean;
}

export const AdaptiveAuroriansTeam: React.FC<AdaptiveAuroriansTeamProps> = ({
  aurorianSummaries,
  onIgnore,
  readOnly,
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
              onIgnore={onIgnore}
              readOnly={readOnly}
            />
          );
        },
      )}
    </Flex>
  );
};

import type React from 'react';
import { Flex } from 'antd';
import type { CopilotNextType } from '@sinsa/schema';
import type { IgnoreMessage } from '../../../types';
import styles from './styles.module.less';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

interface AdaptiveAuroriansTeamProps {
  aurorianRequirements: CopilotNextType['aurorian_requirements'];
  onIgnore?: (msg: IgnoreMessage) => void;
  readOnly?: boolean;
}

export const AdaptiveAuroriansTeam: React.FC<AdaptiveAuroriansTeamProps> = ({
  aurorianRequirements,
  onIgnore,
  readOnly,
}) => {
  return (
    <Flex className={styles.AuroriansTeam}>
      {aurorianRequirements.map(({ aurorian_id, breakthrough, remark }) => {
        return (
          <AdaptiveAurorianCard
            key={aurorian_id}
            aurorianId={aurorian_id}
            breakthrough={breakthrough}
            remark={remark}
            onIgnore={onIgnore}
            readOnly={readOnly}
          />
        );
      })}
    </Flex>
  );
};

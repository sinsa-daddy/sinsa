import type React from 'react';
import { Flex } from 'antd';
import type { AurorianNextType, CopilotNextType } from '@sinsa/schema';
import styles from './styles.module.less';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

interface AdaptiveAuroriansTeamProps {
  aurorianRequirements: CopilotNextType['aurorian_requirements'];
  readOnly?: boolean;
  onReplace?: (aurorian: AurorianNextType) => void;
}

export const AdaptiveAuroriansTeam: React.FC<AdaptiveAuroriansTeamProps> = ({
  aurorianRequirements,
  readOnly,
  onReplace,
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
            readOnly={readOnly}
            onReplace={onReplace}
          />
        );
      })}
    </Flex>
  );
};

import { Button, Flex } from 'antd';
import { produce } from 'immer';
import type { AurorianRequirementType } from '@sinsa/schema';
import { UserPositioning } from '@icon-park/react';
import { useModal } from '@ebay/nice-modal-react';
import styles from './styles.module.less';
import { AurorianTallCard } from '@/components/UploadForm/AurorianTallCard';
import { AurorianSelector } from '@/components/AurorianSelector';

interface CopilotSelector {
  value?: AurorianRequirementType[];
  onChange?: (val: AurorianRequirementType[]) => void;
}

export const CopilotnSelector: React.FC<CopilotSelector> = ({
  value,
  onChange,
}) => {
  const modal = useModal(AurorianSelector);
  return (
    <Flex vertical gap={8}>
      <Button
        type="primary"
        icon={<UserPositioning />}
        onClick={e => {
          e.stopPropagation();
          modal.show({ multi: true, initialValue: value }).then(v => {
            onChange?.(v as AurorianRequirementType[]);
          });
        }}
      >
        快速编队
      </Button>

      <Flex className={styles.AuroriansTeam} wrap="wrap" gap={16}>
        {value?.map(({ aurorian_id, breakthrough, remark }, index) => {
          return (
            <AurorianTallCard
              key={aurorian_id}
              id={aurorian_id}
              breakthrough={breakthrough}
              remark={remark}
              onBreakthroughChange={bt => {
                onChange?.(
                  produce(value, draft => {
                    if (draft) {
                      draft[index].breakthrough = bt;
                    }
                  }),
                );
              }}
              onRemarkChange={r => {
                onChange?.(
                  produce(value, draft => {
                    if (draft) {
                      draft[index].remark = r;
                    }
                  }),
                );
              }}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

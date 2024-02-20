import { antdModalV5, create, useModal } from '@ebay/nice-modal-react';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { Modal } from 'antd';
import { CopilotBlock } from '@/components/SolutionCard/CopilotBlock';

interface DiffModalProps {
  currentTerm: TermNextType;
  originCopilot: CopilotNextType;
}

export const DiffModal = create<DiffModalProps>(
  ({ originCopilot, currentTerm }) => {
    const modal = useModal();
    return (
      <Modal {...antdModalV5(modal)}>
        <CopilotBlock copilot={originCopilot} currentTerm={currentTerm} />
      </Modal>
    );
  },
);

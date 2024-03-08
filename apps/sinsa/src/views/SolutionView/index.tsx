import { Card, Flex } from 'antd';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { SolutionResultProvider } from './context';
import { QueryForm } from './QueryForm';
import { SolutionListView } from './SolutionListView';
import { SolutionAlert } from './SolutionAlert';

interface SolutionViewProps {
  copilots: CopilotNextType[];
  currentTerm: TermNextType;
}

export const SolutionView: React.FC<SolutionViewProps> = ({
  copilots,
  currentTerm,
}) => {
  return (
    <NiceModalProvider>
      <SolutionResultProvider>
        <Flex vertical gap="middle">
          <SolutionAlert currentTerm={currentTerm} />
          <Card>
            <QueryForm copilots={copilots} termId={currentTerm.term_id} />
          </Card>
          <SolutionListView currentTerm={currentTerm} />
        </Flex>
      </SolutionResultProvider>
    </NiceModalProvider>
  );
};

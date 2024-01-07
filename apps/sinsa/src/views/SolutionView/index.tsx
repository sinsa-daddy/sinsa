import type { CopilotType, TermType } from '@sinsa/schema';
import { Card, Flex } from 'antd';
import { SolutionResultProvider } from './context';
import { QueryForm } from './QueryForm';
import { SolutionListView } from './SolutionListView';

interface SolutionViewProps {
  copilots: CopilotType[];
  currentTerm: TermType;
}

export const SolutionView: React.FC<SolutionViewProps> = ({
  copilots,
  currentTerm,
}) => {
  return (
    <SolutionResultProvider>
      <Flex vertical gap="middle">
        <Card>
          <QueryForm copilots={copilots} term={currentTerm.term} />
        </Card>
        <SolutionListView currentTerm={currentTerm} />
      </Flex>
    </SolutionResultProvider>
  );
};

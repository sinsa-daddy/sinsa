import type { CopilotType, TermType } from '@sinsa/schema';
import { Flex } from 'antd';
import { CopilotListView } from './CopilotListView';

interface CopilotsViewProps {
  copilots: CopilotType[];
  currentTerm: TermType;
}

export const CopilotsView: React.FC<CopilotsViewProps> = ({
  copilots,
  currentTerm,
}) => {
  return (
    <Flex vertical gap="middle">
      <CopilotListView dataSource={copilots} currentTerm={currentTerm} />
    </Flex>
  );
};

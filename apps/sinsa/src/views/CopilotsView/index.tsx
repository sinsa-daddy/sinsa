import { Flex } from 'antd';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { CopilotListView } from './CopilotListView';

interface CopilotsViewProps {
  copilots: CopilotNextType[];
  currentTerm: TermNextType;
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

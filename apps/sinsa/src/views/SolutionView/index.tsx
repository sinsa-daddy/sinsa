import type { CopilotType, TermType } from '@sinsa/schema';
import { Card, Flex } from 'antd';

interface SolutionViewProps {
  copilots: CopilotType[];
  currentTerm: TermType;
}

export const SolutionView: React.FC<SolutionViewProps> = () => {
  return (
    <Flex vertical gap="middle">
      <Card>123</Card>
      <Card>456</Card>
    </Flex>
  );
};

import { Card, Flex } from 'antd';
import { LarkLoginCard } from './LarkLoginCard';

interface UploadViewProps {}

export const UploadView: React.FC<UploadViewProps> = () => {
  return (
    <Flex vertical gap="middle">
      <LarkLoginCard />
      <Card>456</Card>
    </Flex>
  );
};

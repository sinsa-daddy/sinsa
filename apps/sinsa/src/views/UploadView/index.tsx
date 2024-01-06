import { Card, Flex } from 'antd';
import { LarkLoginCard } from './LarkLoginCard';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UploadViewProps {}

export const UploadView: React.FC<UploadViewProps> = () => {
  return (
    <Flex vertical gap="middle">
      <LarkLoginCard />
      <Card>456</Card>
    </Flex>
  );
};

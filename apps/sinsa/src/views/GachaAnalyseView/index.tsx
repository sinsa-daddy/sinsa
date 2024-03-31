import { Card, Flex } from 'antd';
import { Query100Form } from './Query100Form';
import { BannerGacha } from './Banner';

export const GachaAnalyseView: React.FC = () => {
  return (
    <Flex vertical gap="middle">
      <Card>
        <Query100Form />
      </Card>
      <BannerGacha />
    </Flex>
  );
};

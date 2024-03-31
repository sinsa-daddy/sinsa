import { Card, Flex } from 'antd';
import type React from 'react';
import { GotOne } from './GotOne';

export const BannerGacha: React.FC = () => {
  return (
    <Card>
      <Card.Meta title="烈日狂沙" style={{ marginBottom: '16px' }} />
      <Flex vertical wrap="nowrap" gap={4}>
        <GotOne aurorianId="azure" cost={32} />
        <GotOne aurorianId="sinsa" cost={12} />
        <GotOne aurorianId="azure" cost={59} />
      </Flex>
    </Card>
  );
};

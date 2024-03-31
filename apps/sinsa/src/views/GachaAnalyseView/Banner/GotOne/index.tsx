/* eslint-disable no-nested-ternary */
import { Flex, Grid, Progress, Typography } from 'antd';
import type React from 'react';
import type { AurorianNextType } from '@sinsa/schema';
import { AdaptiveAurorianCard } from '@/components/AdaptiveAurorianCard';

export interface GotOneProps {
  aurorianId: AurorianNextType['aurorian_id'];
  cost: number;
}

export const GotOne: React.FC<GotOneProps> = ({ aurorianId, cost }) => {
  const screen = Grid.useBreakpoint();
  const percent = (cost / 60) * 100;
  return (
    <Flex wrap="nowrap" gap={8}>
      <div style={{ width: screen.xs ? 60 : 80 }}>
        <AdaptiveAurorianCard readOnly hideMeta aurorianId={aurorianId} />
      </div>
      <Flex style={{ flexGrow: 1 }} justify="center" vertical wrap="nowrap">
        <Flex wrap="nowrap" gap={4} align="center" justify="space-between">
          <Typography.Text style={{ fontSize: '20px' }}>
            <strong style={{ fontWeight: 700 }}>{cost}</strong> 抽
          </Typography.Text>
          <div style={{ width: screen.xs ? 35 : 55 }}>
            <AdaptiveAurorianCard readOnly hideMeta aurorianId={'roy'} />
          </div>
        </Flex>
        <Progress
          percent={percent}
          showInfo={false}
          status={
            percent > 80 ? 'exception' : percent < 50 ? 'success' : 'normal'
          }
        />
      </Flex>
    </Flex>
  );
};

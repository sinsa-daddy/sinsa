import { CheckCard } from '@ant-design/pro-card';
import { useState } from 'react';
import { AurorianBoxCard } from '../AurorianBoxCard';

interface CheckControlAurorianBoxCardProps {
  name: string;
}

export const CheckControlAurorianBoxCard: React.FC<
  CheckControlAurorianBoxCardProps
> = ({ name, ...rest }) => {
  const [breakthrough, setBreakthrough] = useState(0);
  return (
    <CheckCard
      {...rest}
      value={{ name, breakthrough }}
      style={{
        width: 110,
        height: 160,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      cover={
        <AurorianBoxCard
          name={name}
          breakthrough={breakthrough}
          onBreakthroughChange={setBreakthrough}
        />
      }
    />
  );
};

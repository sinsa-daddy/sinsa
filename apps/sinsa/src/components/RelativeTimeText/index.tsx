import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import styles from './styles.module.less';

interface RelativeTimeTextProps {
  time: Date;
}

export const RelativeTimeText = React.memo<RelativeTimeTextProps>(
  ({ time }) => {
    return (
      <Tooltip title={dayjs(time).format('YYYY-MM-DD HH:mm:ss')}>
        <span className={styles.RelativeTimeText}>{dayjs(time).fromNow()}</span>
      </Tooltip>
    );
  },
  (prev, cur) => prev.time.valueOf() === cur.time.valueOf(),
);

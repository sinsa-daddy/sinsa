import React from 'react';
import { Button, Space, Typography } from 'antd';
import { RightSmall } from '@icon-park/react';
import { Link } from '@modern-js/runtime/router';
import styles from './styles.module.less';
import { RoutePath } from '@/views/GlobalLayout/constants';
import { IS_FOOL } from '@/globalTheme';

export const HeroSection = React.memo(() => {
  return (
    <section className={styles.Hero}>
      <Typography.Title className={styles.Name}>
        <span className={IS_FOOL ? styles.AccentFool : styles.Accent}>
          {IS_FOOL ? '白蛙王子' : '红油扳手'}
        </span>
      </Typography.Title>
      <Typography.Paragraph type="secondary" className={styles.Description}>
        个人一站式白夜极光荒典作业收录
      </Typography.Paragraph>
      <Space>
        <Link to={RoutePath.Solutions('latest')}>
          <Button type="primary">
            <span className={styles.GoCopilotButtonText}>立即试试配队</span>
            <RightSmall />
          </Button>
        </Link>
        <Link to={RoutePath.Copilots('latest')}>
          <Button ghost type="primary">
            全览
          </Button>
        </Link>
      </Space>
    </section>
  );
});

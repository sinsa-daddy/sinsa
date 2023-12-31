import type { CopilotType, TermType } from '@sinsa/schema';
import { clsx } from 'clsx';
import { Flex, Statistic, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { AdaptiveAuroriansTeam } from './AdaptiveAuroriansTeam';
import styles from './styles.module.less';
import { ReactComponent as IconMessage } from './assets/icon-message.svg';
import { RelativeTimeText } from '@/components/RelativeTimeText';

interface CopilotBlockProps {
  copilot: CopilotType;
  currentTerm: TermType;
  className?: string;
}

export const CopilotBlock = React.memo<CopilotBlockProps>(
  ({ copilot, currentTerm, className }) => {
    return (
      <div className={clsx(styles.CopilotBlock, className)}>
        <AdaptiveAuroriansTeam aurorianSummaries={copilot.aurorian_summaries} />
        <div className={styles.PaddingContainer}>
          <Flex className={styles.Header}>
            <Statistic value={copilot.score} />
            <Flex className={styles.Author} align="center">
              <Typography.Text strong>{copilot.author}</Typography.Text>
              {copilot.description ? (
                <Typography.Text className={styles.Dot} type="secondary">
                  ·
                </Typography.Text>
              ) : null}
              {copilot.description ? (
                <Tooltip title={copilot.description}>
                  {copilot.description ? <IconMessage /> : null}
                </Tooltip>
              ) : null}
              <Typography.Text className={styles.Dot} type="secondary">
                ·
              </Typography.Text>
              <RelativeTimeText time={copilot.upload_time} />
            </Flex>
          </Flex>
          <div className={styles.Title}>
            <Typography.Link
              href={`https://www.bilibili.com/video/${copilot.bv}`}
              target="_blank"
              title={copilot.title}
              ellipsis={true}
            >
              {currentTerm?.term &&
              copilot.rerun_terms?.includes(currentTerm.term) ? (
                <Tooltip title={`复刻第 ${copilot.term} 期荒典作业`}>
                  <Tag color="red">复刻</Tag>
                </Tooltip>
              ) : null}
              {copilot.title
                .replace('【白夜极光】', '')
                .replace('白夜极光', '')
                .replace('荒典', '')}
            </Typography.Link>
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.className === next.className &&
    prev.copilot.bv === next.copilot.bv &&
    prev.currentTerm.term === next.currentTerm.term,
);

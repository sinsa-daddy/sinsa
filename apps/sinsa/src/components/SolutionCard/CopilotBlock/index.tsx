import type { CopilotType, TermType } from '@sinsa/schema';
import { clsx } from 'clsx';
import {
  Button,
  Dropdown,
  Flex,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import numeral from 'numeral';
import { useBreakpoint } from '@ant-design/pro-components';
import { MessageOne, More, Paperclip, PreviewCloseOne } from '@icon-park/react';
import type { IgnoreMessage } from '../../types';
import { AdaptiveAuroriansTeam } from './AdaptiveAuroriansTeam';
import styles from './styles.module.less';
import { AssetTypeTextMapper } from './constants';
import { RelativeTimeText } from '@/components/RelativeTimeText';
import { trimTitle } from '@/components/utils';

interface CopilotBlockProps {
  copilot: CopilotType;
  currentTerm: TermType;
  className?: string;
  onIgnore?: (msg: IgnoreMessage) => void;
  readOnly?: boolean;
}

export const CopilotBlock = React.memo<CopilotBlockProps>(
  ({ copilot, currentTerm, className, onIgnore, readOnly }) => {
    const screen = useBreakpoint();
    const isLarge = useMemo(
      () => screen === 'lg' || screen === 'xl' || screen === 'xxl',
      [screen],
    );
    const hasAsset = useMemo(() => {
      return Boolean(copilot.asset_link && copilot.asset_type);
    }, [copilot.asset_link, copilot.asset_type]);
    const isHidden = useMemo(
      () => copilot.title.includes('[hidden]'),
      [copilot.title],
    );
    const displayTitle = useMemo(
      () => trimTitle(copilot.title),
      [copilot.title],
    );
    return (
      <div className={clsx(styles.CopilotBlock, className)}>
        <AdaptiveAuroriansTeam
          onIgnore={onIgnore}
          aurorianSummaries={copilot.aurorian_summaries}
          readOnly={readOnly}
        />
        <div className={styles.PaddingContainer}>
          <Flex className={styles.Header}>
            <span className={styles.Score}>
              {numeral(copilot.score).format('0,0')}
            </span>
            <Flex className={styles.Author} align="center">
              <Typography.Text strong>{copilot.author}</Typography.Text>
              {copilot.description && !isLarge ? (
                <Typography.Text className={styles.Dot} type="secondary">
                  ·
                </Typography.Text>
              ) : null}
              {copilot.description && !isLarge ? (
                <Tooltip title={copilot.description}>
                  {copilot.description ? <MessageOne size={18} /> : null}
                </Tooltip>
              ) : null}
              <Typography.Text className={styles.Dot} type="secondary">
                ·
              </Typography.Text>
              <RelativeTimeText time={copilot.upload_time} />
              <Typography.Text className={styles.Dot} type="secondary" />
              {!readOnly ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'ignore',
                        label: (
                          <span>
                            <PreviewCloseOne /> 排除此作业
                          </span>
                        ),
                      },
                    ],
                    onClick(info) {
                      if (info.key === 'ignore') {
                        onIgnore?.({
                          type: 'copilot',
                          bv: copilot.bv,
                        });
                      }
                    },
                  }}
                >
                  <Button size="small" icon={<More />} />
                </Dropdown>
              ) : null}
            </Flex>
          </Flex>
          <div className={styles.Title}>
            <Typography.Link
              disabled={isHidden}
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
              {displayTitle}
            </Typography.Link>
          </div>
          {copilot.description && isLarge ? (
            <Typography.Paragraph type="secondary">
              {copilot.description}
            </Typography.Paragraph>
          ) : null}
          {hasAsset && isLarge ? (
            <Popconfirm
              okText="确认"
              title="此资源仅为临时存档。是否开始下载？"
              onConfirm={() => {
                const el = document.createElement('a');
                el.href = copilot.asset_link!;
                el.click();
              }}
            >
              <Typography.Link>
                <Paperclip /> {AssetTypeTextMapper[copilot.asset_type!]}
                存档
              </Typography.Link>
            </Popconfirm>
          ) : null}
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.className === next.className &&
    prev.copilot.bv === next.copilot.bv &&
    prev.currentTerm.term === next.currentTerm.term,
);

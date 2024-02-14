import { clsx } from 'clsx';
import {
  Button,
  Dropdown,
  Flex,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import numeral from 'numeral';
import { useBreakpoint } from '@ant-design/pro-components';
import {
  MessageOne,
  More,
  Paperclip,
  PreviewCloseOne,
  Bug,
} from '@icon-park/react';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import type { IgnoreMessage } from '../../types';
import { AdaptiveAuroriansTeam } from './AdaptiveAuroriansTeam';
import styles from './styles.module.less';
import { AssetTypeTextMapper } from './constants';
import { RelativeTimeText } from '@/components/RelativeTimeText';
import { trimTitle } from '@/components/utils';

interface CopilotBlockProps {
  copilot: CopilotNextType;
  currentTerm: TermNextType;
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
      return Array.isArray(copilot.assets);
    }, [copilot.assets]);

    const displayTitle = useMemo(
      () => trimTitle(copilot.title),
      [copilot.title],
    );

    function handleClickMenu(info: { key: string }) {
      switch (info.key) {
        case 'ignore':
          onIgnore?.({
            type: 'copilot',
            copilotId: copilot.copilot_id,
          });
          break;
        default:
          break;
      }
    }
    return (
      <div className={clsx(styles.CopilotBlock, className)}>
        <AdaptiveAuroriansTeam
          onIgnore={onIgnore}
          aurorianRequirements={copilot.aurorian_requirements}
          readOnly={readOnly}
        />
        <div className={styles.PaddingContainer}>
          <Flex className={styles.Header}>
            <span className={styles.Score}>
              {numeral(copilot.score).format('0,0')}
            </span>
            <Flex className={styles.Author} align="center" gap={6}>
              <Typography.Text strong>{copilot.author_name}</Typography.Text>

              {copilot.description && !isLarge ? (
                <Tooltip title={copilot.description}>
                  {copilot.description ? <MessageOne size={18} /> : null}
                </Tooltip>
              ) : null}

              <RelativeTimeText time={copilot.upload_time} />

              <Space.Compact size="small">
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
                      onClick: handleClickMenu,
                    }}
                  >
                    <Button icon={<More />} />
                  </Dropdown>
                ) : null}

                <Button
                  icon={
                    <Tooltip title="报告收录错误">
                      <Bug />
                    </Tooltip>
                  }
                  onClick={e => {
                    e.stopPropagation();
                    window.open(
                      `https://fwf92qm5h53.feishu.cn/share/base/form/shrcnFMYfIOulCFwcl5ELDfGCVf?prefill_${window.encodeURIComponent(
                        '收录有问题的作业视频链接',
                      )}=${window.encodeURIComponent(
                        `${copilot.author_name} ${copilot.title} https://www.bilibili.com/video/${copilot.href}`,
                      )}`,
                    );
                  }}
                />
              </Space.Compact>
            </Flex>
          </Flex>
          <div className={styles.Title}>
            <Typography.Link
              href={`https://www.bilibili.com/video/${copilot.href}`}
              target="_blank"
              title={copilot.title}
              ellipsis={true}
            >
              {currentTerm?.term_id &&
              copilot.term_id !== currentTerm.term_id ? (
                <Tooltip title={`复刻 ${copilot.term_id} 期荒典`}>
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
          {hasAsset && isLarge
            ? copilot.assets?.map((asset, index) => (
                <Popconfirm
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${asset.type}${index}`}
                  okText="确认"
                  title="此资源仅为临时存档。是否开始下载？"
                  onConfirm={() => {
                    const el = document.createElement('a');
                    el.href = asset.script33.link;
                    el.click();
                  }}
                >
                  <Typography.Link>
                    <Paperclip /> {AssetTypeTextMapper[asset.type]}
                    存档
                  </Typography.Link>
                </Popconfirm>
              ))
            : null}
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.className === next.className &&
    prev.copilot.copilot_id === next.copilot.copilot_id &&
    prev.currentTerm.term_id === next.currentTerm.term_id,
);

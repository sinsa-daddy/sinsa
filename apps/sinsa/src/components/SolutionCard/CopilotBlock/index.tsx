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
import React, { useCallback, useMemo } from 'react';
import numeral from 'numeral';
import { useBreakpoint } from '@ant-design/pro-components';
import {
  MessageOne,
  More,
  Paperclip,
  PreviewCloseOne,
  Bug,
  Caution,
} from '@icon-park/react';
import type {
  AurorianNextType,
  CopilotNextType,
  TermNextType,
} from '@sinsa/schema';
import { AdaptiveAuroriansTeam } from './AdaptiveAuroriansTeam';
import styles from './styles.module.less';
import { AssetTypeTextMapper } from './constants';
import { RelativeTimeText } from '@/components/RelativeTimeText';
import { trimTitle } from '@/components/utils';
import { useSolutionResultContext } from '@/views/SolutionView/context';
import { QueryFormAction } from '@/views/SolutionView/hooks/use-trigger-form-action/constants';
import { realRandomService } from '@/services/real-random';

interface CopilotBlockProps {
  copilot: CopilotNextType;
  currentTerm: TermNextType;
  className?: string;

  readOnly?: boolean;
}

enum MenuKey {
  IgnoreCopilot = 'IgnoreCopilot',
}

function useLarge() {
  const screen = useBreakpoint();
  const isLarge = useMemo(
    () => screen === 'lg' || screen === 'xl' || screen === 'xxl',
    [screen],
  );

  return isLarge;
}

export const CopilotBlock = React.memo<CopilotBlockProps>(
  ({ copilot, currentTerm, className, readOnly }) => {
    const isLarge = useLarge();
    const hasAsset = useMemo(() => {
      return Array.isArray(copilot.assets);
    }, [copilot.assets]);

    const displayTitle = useMemo(
      () => trimTitle(copilot.title),
      [copilot.title],
    );

    const { triggerFormAction } = useSolutionResultContext();

    const handleClickMenu = useCallback(
      (info: { key: string }) => {
        switch (info.key) {
          case MenuKey.IgnoreCopilot:
            triggerFormAction({
              type: QueryFormAction.IgnoreCopilot,
              copilot,
            });
            break;
          default:
            break;
        }
      },
      [copilot.copilot_id],
    );

    const handleReplace = useCallback(
      (_aurorian: AurorianNextType) => {
        triggerFormAction({
          type: QueryFormAction.ReplaceAurorian,
          aurorian: _aurorian,
          copilot,
          currentTerm,
        });
      },
      [copilot.copilot_id, currentTerm.term_id],
    );

    const realRandomResult = useMemo(() => {
      return realRandomService.isRealRandom(copilot);
    }, [copilot.copilot_id]);

    return (
      <div className={clsx(styles.CopilotBlock, className)}>
        <AdaptiveAuroriansTeam
          aurorianRequirements={copilot.aurorian_requirements}
          readOnly={readOnly}
          onReplace={handleReplace}
        />
        <div className={styles.PaddingContainer}>
          <Flex className={styles.Header} wrap="nowrap" align="center">
            <span className={styles.Score}>
              {numeral(copilot.score).format('0,0')}
            </span>
            <Flex className={styles.Author} align="center" gap={4}>
              <Space.Compact size="small">
                {!readOnly ? (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: MenuKey.IgnoreCopilot,
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
                    const params = {
                      有收录问题的作业所在荒典期数: copilot.term_id,
                      有收录问题的作业视频链接: `${copilot.author_name} ${copilot.title} https://www.bilibili.com/video/${copilot.href}`,
                    };

                    const queryString = Object.entries(params)
                      .map(
                        ([key, value]) =>
                          `prefill_${window.encodeURIComponent(
                            key,
                          )}=${window.encodeURIComponent(value)}`,
                      )
                      .join('&');
                    window.open(
                      `https://fwf92qm5h53.feishu.cn/share/base/form/shrcnFMYfIOulCFwcl5ELDfGCVf?${queryString}`,
                      '_blank',
                    );
                  }}
                />
              </Space.Compact>
              <RelativeTimeText time={copilot.upload_time} />

              {copilot.description && !isLarge ? (
                <Tooltip title={copilot.description}>
                  {copilot.description ? <MessageOne size={18} /> : null}
                </Tooltip>
              ) : null}

              <span
                className={clsx(
                  styles.AuthorName,
                  !isLarge && styles.AuthorSmall,
                )}
              >
                {copilot.author_name}
              </span>
            </Flex>
          </Flex>
          <div className={styles.Title}>
            <Typography.Link
              href={`https://www.bilibili.com/video/${copilot.href}`}
              target="_blank"
              title={copilot.title}
              ellipsis={true}
              onClick={e => {
                e.stopPropagation();
                window.browserClient.sendEvent?.({
                  name: 'go_to_copilot',
                  metrics: {
                    score: copilot.score,
                  },
                  categories: {
                    copilot_source: copilot.source_type,
                    author: copilot.author_id,
                    author_name: copilot.author_name,
                    term_id: copilot.term_id,
                    href: copilot.href,
                    copilot_id: copilot.copilot_id,
                    title: copilot.title,
                  },
                });
              }}
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
          {realRandomResult.isRealRandomResult ? (
            <>
              <Typography.Text type="secondary">
                <Caution /> 此作业无法抄：
                <Tooltip
                  title={realRandomResult.stack.map(i => i.reason).join('、')}
                >
                  <span className={styles.ReasonText}>查看原因</span>
                </Tooltip>{' '}
                <Typography.Link
                  onClick={e => {
                    e.stopPropagation();
                    handleClickMenu({
                      key: MenuKey.IgnoreCopilot,
                    });
                  }}
                >
                  排除此作业
                </Typography.Link>
              </Typography.Text>
            </>
          ) : null}
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

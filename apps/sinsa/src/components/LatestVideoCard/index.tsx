/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import { Button, Card, Flex, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { useModel } from '@modern-js/runtime/model';
import dayjs from 'dayjs';
import { first, maxBy, minBy } from 'lodash-es';
import { useRequest } from 'ahooks';
import { RelativeTimeText } from '../RelativeTimeText';
import { trimTitle } from '../utils';
import { useLatestVideo } from './useLatestVideo';
import styles from './styles.module.less';
import type { SimpleLatestCopilotType } from './schemas/SimpleLatestCopilot';
import { FeishuModel } from '@/models/feishu';

interface LatestVideoCardProps {
  onClickNewCard?: (newBvid: string) => void;
  currentTermId?: string;
}

interface LatestVideoCardRef {
  refresh: () => void;
  latestMaxAndMinScoreCopilots: {
    maxScoreCopilot: SimpleLatestCopilotType | undefined;
    minScoreCopilot: SimpleLatestCopilotType | undefined;
  };
}

export function useLatestVideoCardRef() {
  const ref = useRef<LatestVideoCardRef>(null);
  return ref;
}

export const LatestVideoCard = React.forwardRef<
  LatestVideoCardRef,
  LatestVideoCardProps
>(({ onClickNewCard, currentTermId }, ref) => {
  const {
    loadingLatestCopilots,
    loadingLatestVideos,
    getLatestCopilotsAsync,
    getLatestVideosAsync,
    latestCopilots,
    latestVideos,
    refresh,
  } = useLatestVideo();
  const [{ isLogin }] = useModel(FeishuModel);

  useEffect(() => {
    if (isLogin) {
      getLatestCopilotsAsync();
      getLatestVideosAsync();
    }
  }, [isLogin]);

  const latestMaxAndMinScoreCopilots = useMemo(() => {
    const currentTermCopilots = latestCopilots?.filter(
      c => c.term_id === currentTermId,
    );
    const maxScoreCopilot = maxBy(currentTermCopilots, c => c.score);
    const minScoreCopilot = minBy(currentTermCopilots, c => c.score);

    return {
      maxScoreCopilot,
      minScoreCopilot,
    };
  }, [latestCopilots, currentTermId]);

  useImperativeHandle(
    ref,
    () => {
      return {
        refresh,
        latestMaxAndMinScoreCopilots,
      };
    },
    [refresh, latestMaxAndMinScoreCopilots],
  );

  const { data, loading: loadingDenyList } = useRequest(async () => {
    const list = await import('./deny-list.json');

    return {
      list: Array.from(list),
    };
  }, {});

  if (!isLogin) {
    return null;
  }

  return (
    <Card
      title="B站视频最新收录情况：最近 20 条按新发布排序搜索结果"
      loading={loadingLatestCopilots || loadingLatestVideos || loadingDenyList}
      bodyStyle={{ overflow: 'auto', height: 400 }}
      extra={
        <Button
          type="primary"
          loading={loadingLatestCopilots || loadingLatestVideos}
          onClick={e => {
            e.stopPropagation();
            refresh();
          }}
        >
          刷新
        </Button>
      }
    >
      {latestCopilots && latestVideos ? (
        <Flex wrap="wrap" gap="small">
          {latestVideos.result.map(video => {
            const displayTitle = trimTitle(video.title);

            const copilotInfo = latestCopilots.find(c =>
              c.href.startsWith(video.bvid),
            );

            const onlyHitAuthor =
              video.hit_columns.length === 1 &&
              video.hit_columns.includes('author');

            const tooShort = first(video.duration.split(':')) === '0';

            const inDenyList = data?.list.includes(video.bvid);

            return (
              <Card
                hoverable={!copilotInfo && !inDenyList}
                className={styles.Card}
                size="small"
                key={video.bvid}
                cover={
                  <div className={styles.CoverContainer}>
                    <Flex className={styles.UploadedTagContainer} wrap="wrap">
                      {copilotInfo ? (
                        <Tooltip
                          title={`${copilotInfo?.created_by.name} 于 ${dayjs(
                            copilotInfo?.created_time,
                          ).format('YYYY-MM-DD HH:mm:ss')} 收录了此作业`}
                        >
                          <Tag color="green">已收录</Tag>
                        </Tooltip>
                      ) : inDenyList ? null : (
                        <Tag color={'#dc5950'}>未收录</Tag>
                      )}
                      {onlyHitAuthor || tooShort ? (
                        <Tag color="orange-inverse">疑似非荒典作业</Tag>
                      ) : null}
                      {inDenyList ? <Tag color="gray">无需收录</Tag> : null}
                    </Flex>
                    <img
                      className={styles.CoverImage}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      alt={video.title}
                      src={`${video.pic}@672w_378h_1c_!web-search-common-cover.webp`}
                    />
                    <div className={styles.Duration}>{video.duration}</div>
                  </div>
                }
                onClick={e => {
                  e.stopPropagation();
                  if (!copilotInfo) {
                    onClickNewCard?.(video.bvid);
                  }
                }}
              >
                <Flex className={styles.Author} align="center">
                  <Typography.Text strong>{video.author}</Typography.Text>
                  <Typography.Text className={styles.Dot} type="secondary">
                    ·
                  </Typography.Text>
                  <RelativeTimeText time={new Date(video.pubdate)} />
                </Flex>
                <div className={styles.Title}>
                  <Typography.Link
                    href={`https://www.bilibili.com/video/${video.bvid}`}
                    target="_blank"
                    title={video.title}
                    ellipsis={true}
                    onClick={e => e.stopPropagation()}
                  >
                    <span dangerouslySetInnerHTML={{ __html: displayTitle }} />
                  </Typography.Link>
                </div>
              </Card>
            );
          })}
        </Flex>
      ) : null}
    </Card>
  );
});

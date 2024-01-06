/* eslint-disable react/no-danger */
import { Button, Card, Flex, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useModel } from '@modern-js/runtime/model';
import dayjs from 'dayjs';
import { RelativeTimeText } from '../RelativeTimeText';
import { trimTitle } from '../utils';
import { useLatestVideo } from './useLatestVideo';
import styles from './styles.module.less';
import { FeishuModel } from '@/models/feishu';

interface LatestVideoCardProps {
  onClickNewCard?: (newBvid: string) => void;
}

interface LatestVideoCardRef {
  refresh: () => void;
}

export function useLatestVideoCardRef() {
  const ref = useRef<LatestVideoCardRef>(null);
  return ref;
}

export const LatestVideoCard = React.forwardRef<
  LatestVideoCardRef,
  LatestVideoCardProps
>(({ onClickNewCard }, ref) => {
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

  useImperativeHandle(
    ref,
    () => {
      return {
        refresh,
      };
    },
    [refresh],
  );

  if (!isLogin) {
    return null;
  }

  return (
    <Card
      title="B站视频最新收录情况：最近 20 条按新发布排序搜索结果"
      loading={loadingLatestCopilots || loadingLatestVideos}
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

            const copilotInfo = latestCopilots.find(c => c.bv === video.bvid);

            return (
              <Card
                hoverable={!copilotInfo}
                className={styles.Card}
                size="small"
                key={video.bvid}
                cover={
                  <img
                    className={styles.CoverImage}
                    crossOrigin="use-credentials"
                    alt={video.title}
                    src={video.pic}
                  />
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
                {copilotInfo ? (
                  <Tooltip
                    title={`${copilotInfo?.creator.name} 于 ${dayjs(
                      copilotInfo?.insert_db_time,
                    ).format('YYYY-MM-DD HH:mm:ss')} 收录了此作业`}
                  >
                    <Tag className={styles.UploadedTag} color="green">
                      已收录
                    </Tag>
                  </Tooltip>
                ) : (
                  <Tag className={styles.UploadedTag} color={'#dc5950'}>
                    未收录
                  </Tag>
                )}
              </Card>
            );
          })}
        </Flex>
      ) : null}
    </Card>
  );
});

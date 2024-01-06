import React, { useMemo } from 'react';

interface VideoIframeProps {
  bvid?: string;
}

export const VideoIframe = React.memo<VideoIframeProps>(({ bvid }) => {
  const url = useMemo(() => {
    if (typeof bvid === 'string') {
      const src = new URL('https://player.bilibili.com/player.html');
      src.searchParams.append('bvid', bvid);
      return src.href;
    }
    return undefined;
  }, [bvid]);

  if (url) {
    return (
      <iframe
        src={url}
        scrolling="no"
        frameBorder="no"
        style={{ border: 0, width: 700, height: 420 }}
      ></iframe>
    );
  }

  return null;
});

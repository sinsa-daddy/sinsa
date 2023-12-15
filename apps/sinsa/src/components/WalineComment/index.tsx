import { useEffect, useRef, createRef } from 'react';
import {
  type WalineInstance,
  type WalineInitOptions,
  init,
} from '@waline/client';
import { Typography } from 'antd';

export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string };

export const WalineComment: React.FC<WalineOptions> = props => {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      locale: {
        admin: '管理员',
        level0: 'LV1',
        level1: 'LV2',
        level2: 'LV3',
        level3: 'LV4',
        level4: 'LV5',
        level5: 'LV6',
        submit: '评论',
        placeholder: '我们的评论也是超美学的',
      },
      emoji: [
        '//registry.npmmirror.com/@waline/emojis/1.2.0/files/bmoji',
        '//registry.npmmirror.com/@waline/emojis/1.2.0/files/alus',
      ],
      search: false,
    });

    const poweredBy = document.querySelector('.wl-power');
    if (poweredBy) {
      poweredBy.parentNode?.removeChild(poweredBy);
    }

    return () => walineInstanceRef.current?.destroy();
  }, []);

  useEffect(() => {
    walineInstanceRef.current?.update(props);
  }, []);
  return (
    <>
      <Typography.Title level={5}>这期荒典感觉怎样？</Typography.Title>
      <div ref={containerRef} />
    </>
  );
};

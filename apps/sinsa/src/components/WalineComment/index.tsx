import { useEffect, useRef, createRef } from 'react';
import {
  type WalineInstance,
  type WalineInitOptions,
  init,
} from '@waline/client';

export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string };

export const WalineComment: React.FC<WalineOptions> = props => {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      locale: {},
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
  }, [props]);
  return <div ref={containerRef} />;
};

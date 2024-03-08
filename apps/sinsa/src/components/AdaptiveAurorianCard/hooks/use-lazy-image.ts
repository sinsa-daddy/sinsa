import { useEffect, useRef } from 'react';

interface LazyImageOptions {
  type?: 'awaken' | 'skin-1';
}

const FileNameTypeMap: Record<string, LazyImageOptions | undefined> = {
  bethel: { type: 'awaken' },
  luke: { type: 'awaken' },
  zarya: { type: 'skin-1' },
  fleur: { type: 'awaken' },
};

export function useLazyImage(aurorianId: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadImage = async () => {
      if (aurorianId && containerRef.current) {
        const options = FileNameTypeMap[aurorianId];
        const filename = options?.type
          ? `${aurorianId}-${options.type}`
          : aurorianId;

        containerRef.current.style.backgroundImage = `url(/assets/images/avatars/${filename}.webp)`;
      }
    };
    loadImage();
  }, [aurorianId]);

  return {
    containerRef,
  };
}

import { useEffect, useRef } from 'react';

interface LazyImageOptions {
  type?: 'awaken' | 'skin-1';
  ext?: '.webp' | '.png';
  suffix?: string;
}

const FileNameTypeMap: Record<string, LazyImageOptions | undefined> = {
  bethel: { type: 'awaken' },
  luke: { type: 'awaken' },
  zarya: { type: 'skin-1' },
  fleur: { type: 'awaken' },
  ryza: { ext: '.png', suffix: '-v1' },
  patricia: { ext: '.png', suffix: '-v1' },
  klaudia: { ext: '.png', suffix: '-v1' },
};

export function useLazyImage(aurorianId: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadImage = async () => {
      if (aurorianId && containerRef.current) {
        const options = FileNameTypeMap[aurorianId];
        const finalExt = options?.ext ?? '.webp';
        const filename = options?.type
          ? `${aurorianId}-${options.type}`
          : aurorianId;
        const suffix = options?.suffix ?? '';

        containerRef.current.style.backgroundImage = `url(/assets/images/avatars/${filename}${suffix}${finalExt})`;
      }
    };
    loadImage();
  }, [aurorianId]);

  return {
    containerRef,
  };
}

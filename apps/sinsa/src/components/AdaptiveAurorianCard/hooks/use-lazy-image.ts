import { useEffect, useRef } from 'react';

export function useLazyImage(aurorianId?: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadImage = async () => {
      if (aurorianId) {
        const href = `https://gitee.com/sinsa-daddy/statics/raw/master/avatars/${aurorianId}.webp`;
        if (containerRef.current) {
          containerRef.current.style.backgroundImage = `url(${href})`;
        }
      }
    };
    loadImage();
  }, [aurorianId]);

  return {
    containerRef,
  };
}

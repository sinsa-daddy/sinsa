import { useEffect, useRef } from 'react';

export function useLazyImage(aurorianId?: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadImage = async () => {
      if (aurorianId && containerRef.current) {
        const module = await import(`@/assets/avatars/${aurorianId}.webp`);
        containerRef.current.style.backgroundImage = `url(${module.default})`;
      }
    };
    loadImage();
  }, [aurorianId]);

  return {
    containerRef,
  };
}

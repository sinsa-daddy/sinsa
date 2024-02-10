import { useEffect, useRef } from 'react';

export function useLazyImage(aurorianId?: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadImage = async () => {
      if (aurorianId && containerRef.current) {
        containerRef.current.style.backgroundImage = `url(/assets/images/avatars/${aurorianId}.webp)`;
      }
    };
    loadImage();
  }, [aurorianId]);

  return {
    containerRef,
  };
}

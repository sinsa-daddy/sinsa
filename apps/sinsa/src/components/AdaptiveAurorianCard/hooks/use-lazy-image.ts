import { useEffect, useRef } from 'react';

export function useLazyImage(aurorian_name?: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadImage = async () => {
      if (aurorian_name) {
        const module = await import(`@/assets/skins/${aurorian_name}.webp`);
        if (typeof module?.default === 'string') {
          if (containerRef.current) {
            containerRef.current.style.backgroundImage = `url(${module.default})`;
          }
        }
      }
    };
    loadImage();
  }, [aurorian_name]);

  return {
    containerRef,
  };
}

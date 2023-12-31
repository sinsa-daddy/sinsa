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

    const observer = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) {
        return;
      }
      loadImage();
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [aurorian_name]);

  return {
    containerRef,
  };
}

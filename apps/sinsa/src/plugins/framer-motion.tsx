import { LazyMotion, domAnimation } from 'framer-motion';

export const ReducedLazyMotion: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};

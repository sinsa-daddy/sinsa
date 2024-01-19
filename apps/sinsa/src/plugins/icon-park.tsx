import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react';
import type React from 'react';

const ICON_CONFIG = {
  ...DEFAULT_ICON_CONFIGS,
  prefix: 'sinsa-icon',
};

export const IconParkProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <IconProvider value={ICON_CONFIG}>{children}</IconProvider>;
};

import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react';
import type { IIconConfig } from '@icon-park/react/lib/runtime';
import type React from 'react';

const ICON_CONFIG: IIconConfig = {
  ...DEFAULT_ICON_CONFIGS,
  theme: 'multi-color',
  colors: {
    outline: {
      fill: 'currentColor',
      background: 'transparent',
    },
    filled: {
      fill: 'currentColor',
      background: '#FFF',
    },
    twoTone: {
      fill: 'currentColor',
      twoTone: '#DC5950',
    },
    multiColor: {
      outStrokeColor: 'currentColor',
      outFillColor: '#DC5950',
      innerStrokeColor: '#FFF',
      innerFillColor: '#E3776B',
    },
  },
};

export const IconParkProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <IconProvider value={ICON_CONFIG}>{children}</IconProvider>;
};

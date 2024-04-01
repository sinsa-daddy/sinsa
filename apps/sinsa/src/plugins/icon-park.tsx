import { GLOBAL_THEME } from '@/globalTheme';
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
      background: GLOBAL_THEME.primaryBackgroundColor,
    },
    twoTone: {
      fill: 'currentColor',
      twoTone: GLOBAL_THEME.primaryColor,
    },
    multiColor: {
      outStrokeColor: 'currentColor',
      outFillColor: GLOBAL_THEME.primaryColor,
      innerStrokeColor: GLOBAL_THEME.primaryBackgroundColor,
      innerFillColor: GLOBAL_THEME.primaryColorLight,
    },
  },
};

export const IconParkProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <IconProvider value={ICON_CONFIG}>{children}</IconProvider>;
};

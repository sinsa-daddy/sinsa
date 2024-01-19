import { useModel } from '@modern-js/runtime/model';
import type { ThemeConfig } from 'antd';
import { ConfigProvider, theme as antDesignTheme } from 'antd';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { DarkModel } from '@/models/dark';
import { DARK_MODE_KEY } from '@/services/dark-mode';
import { IconParkProvider } from '@/plugins/icon-park';

const ANTD_PREFIX_CLASSNAME = 'sinsa' as const;
const COLOR_PRIMARY = 'rgb(220, 89, 80)';

function useAntDesignTheme() {
  const [{ mode }] = useModel(DarkModel);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, mode);
  }, [mode]);

  const theme = useMemo<ThemeConfig>(() => {
    let algorithm = antDesignTheme.defaultAlgorithm;
    if (mode === 'dark') {
      algorithm = antDesignTheme.darkAlgorithm;
    }
    return {
      token: {
        colorPrimary: COLOR_PRIMARY,
        colorLink: COLOR_PRIMARY,
      },
      algorithm,
    };
  }, [mode]);

  return {
    theme,
  };
}

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme } = useAntDesignTheme();
  return (
    <ConfigProvider prefixCls={ANTD_PREFIX_CLASSNAME} theme={theme}>
      <IconParkProvider>{children}</IconParkProvider>
    </ConfigProvider>
  );
};

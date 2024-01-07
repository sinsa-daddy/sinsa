import { useLocalStorageState } from 'ahooks';

type DarkModeType = 'system' | 'light' | 'dark';

export const DARK_MODE_KEY = 'SINSA_DADDY_THEME_DARK_MODE';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorageState<DarkModeType>(
    'SINSA_DADDY_THEME_DARK_MODE',
    {
      defaultValue: 'system',
    },
  );

  return {
    darkMode,
    setDarkMode,
  };
}

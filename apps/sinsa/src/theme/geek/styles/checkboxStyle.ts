import type { FullToken, GenerateStyle } from 'antd/es/theme/internal';
import { DOT_PREFIX } from '../constant';
import { genComponentStyleHook } from './styleUtil';

import { background, getBorderStyle } from './gradientUtil';

// ============================== Border ==============================
export const genStyle: GenerateStyle<
  FullToken<'Checkbox'> | FullToken<'Radio'>
> = token => {
  const { componentCls, lineWidth } = token;

  return {
    [`${DOT_PREFIX}${componentCls}-wrapper`]: {
      [componentCls]: {
        '&:before': [
          ...getBorderStyle(lineWidth),
          {
            inset: 0,
          },
        ],

        [`&${componentCls}-checked ${componentCls}-inner`]: {
          background: `${background} !important`,
        },
      },

      '&-disabled': {
        [componentCls]: {
          '&:before': {
            opacity: token.opacityLoading,
          },
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(['Checkbox', 'techTheme'], token => {
  return [genStyle(token as any)];
});

import type { FullToken, GenerateStyle } from 'antd/es/theme/internal';
import { DOT_PREFIX } from '../constant';
import { genComponentStyleHook } from './styleUtil';

import {
  getAnimationBackground,
  getBackgroundAnimation,
  getBorderStyle,
} from './gradientUtil';

// ============================== Border ==============================
const genBorderStyle: GenerateStyle<FullToken<'Button'>> = token => {
  const { componentCls, lineWidth } = token;

  const backgroundAnimation = getBackgroundAnimation(lineWidth);

  return {
    [`${componentCls}${DOT_PREFIX}`]: {
      // ======================= Primary =======================
      [`&${componentCls}-primary`]: {
        [`&:not(${componentCls}-dangerous)`]: {
          ...getAnimationBackground(lineWidth),
          ...backgroundAnimation,

          '&:disabled': {
            opacity: token.opacityLoading,
            color: token.colorTextLightSolid,
          },
        },
      },

      // ======================= Default =======================
      [`&${componentCls}-default`]: {
        [`&:not(${componentCls}-dangerous)`]: {
          '&:before': getBorderStyle(lineWidth),

          '&:not(:disabled):hover': {
            color: token.colorTextLightSolid,
          },

          '&:disabled:before': {
            opacity: token.opacityLoading,
          },
        },
      },

      // ======================== Hover ========================
      [`&${componentCls}-primary, &${componentCls}-default`]: {
        [`&:not(:disabled):not(${componentCls}-dangerous)`]: {
          '&:hover': {
            filter: `brightness(120%)`,
          },
          '&:active': {
            filter: `brightness(80%)`,
          },
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(['Button', 'techTheme'], token => {
  return [genBorderStyle(token as any)];
});

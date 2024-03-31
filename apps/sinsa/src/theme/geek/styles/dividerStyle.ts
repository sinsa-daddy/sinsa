import type { FullToken, GenerateStyle } from 'antd/es/theme/internal';
import { DOT_PREFIX } from '../constant';
import { genComponentStyleHook } from './styleUtil';

import { background } from './gradientUtil';

// ============================== Border ==============================
const genStyle: GenerateStyle<FullToken<'Divider'>> = token => {
  const { componentCls, lineWidth } = token;

  return {
    [`${DOT_PREFIX}${componentCls}`]: {
      [`&${componentCls}-horizontal`]: {
        border: 'none',
        height: lineWidth,
        background,
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(['Divider', 'techTheme'], token => {
  return [genStyle(token as any)];
});

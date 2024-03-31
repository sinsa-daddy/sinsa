import type { FullToken, GenerateStyle } from 'antd/es/theme/internal';
import { DOT_PREFIX } from '../constant';
import { genComponentStyleHook } from './styleUtil';

import { background } from './gradientUtil';

// ============================== Border ==============================
const genStyle: GenerateStyle<FullToken<'Switch'>> = token => {
  const { componentCls } = token;

  return {
    [`${componentCls}${DOT_PREFIX}`]: {
      [`&${componentCls}&${componentCls}-checked`]: {
        '&, &:hover, &:focus': {
          background: `${background} !important`,
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(['Switch', 'techTheme'], token => {
  return [genStyle(token as any)];
});

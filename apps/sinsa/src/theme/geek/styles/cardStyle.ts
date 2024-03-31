import type { FullToken, GenerateStyle } from 'antd/es/theme/internal';
import { DOT_PREFIX } from '../constant';
import { genComponentStyleHook } from './styleUtil';

import { getBorderStyle } from './gradientUtil';

// ============================== Border ==============================
const genStyle: GenerateStyle<FullToken<'Card'>> = token => {
  const { componentCls, lineWidth } = token;

  return {
    [`${componentCls}${DOT_PREFIX}`]: {
      '&:before': getBorderStyle(lineWidth),

      [`${componentCls}-head`]: {
        position: 'relative',

        '&:before': [
          ...getBorderStyle(lineWidth),
          {
            transition: 'none',
          },
        ],
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook(['Card', 'techTheme'], token => {
  return [genStyle(token as any)];
});

import type { ProFormInstance } from '@ant-design/pro-components';
import type { FormValues } from '../types';

export function trimBV(
  form: ProFormInstance<FormValues> | undefined,
  bvOrLink?: string,
) {
  if (
    typeof bvOrLink === 'string' &&
    (bvOrLink.startsWith('https://') || bvOrLink.startsWith('http://'))
  ) {
    const bvResult = /\/(BV[^/]+)\/?/.exec(new URL(bvOrLink).pathname)?.[1];
    if (typeof bvResult === 'string' && bvResult.startsWith('BV')) {
      form?.setFieldValue('bv', bvResult);
    }
  }
}

import { ProForm, ProFormText } from '@ant-design/pro-components';
import type { Query100FormValuesType } from './types';
import { ensureQuery100Key } from './utiles';

export const Query100Form: React.FC = () => {
  return (
    <ProForm<Query100FormValuesType> layout="inline">
      <ProFormText name={ensureQuery100Key('href')} label="导出链接" />
      <ProFormText.Password
        name={ensureQuery100Key('code')}
        label="二次校验码"
      />
    </ProForm>
  );
};

import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { MyLayout } from '../components/MyLayout';
import type { LayoutLoaderData } from './layout.data';
import { TermsModel } from '@/models/terms';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#5c5c5c',
  },
};

export default function Layout() {
  const { terms: termsFromRemote } = useLoaderData() as LayoutLoaderData;

  const [terms, actions] = useModel(TermsModel);

  if (terms.terms.length === 0) {
    actions.setTerms(termsFromRemote);
  }

  return (
    <ConfigProvider prefixCls="sinsa" theme={theme}>
      <MyLayout>
        <Outlet />
      </MyLayout>
    </ConfigProvider>
  );
}

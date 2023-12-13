import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { isEmpty } from 'lodash-es';
import { MyLayout } from '../components/MyLayout';
import type { LayoutLoaderData } from './layout.data';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';

const theme: ThemeConfig = {
  token: {
    colorPrimary: 'rgb(220, 89, 80)',
  },
};

export default function Layout() {
  const { terms: termsFromRemote, auroriansMap: auroriansMapFromRemote } =
    useLoaderData() as LayoutLoaderData;

  const [terms, termsActions] = useModel(TermsModel);
  if (terms.terms.length === 0) {
    termsActions.setTerms(termsFromRemote);
  }

  const [aurorians, auroriansActions] = useModel(AuroriansModel);
  if (isEmpty(aurorians.auroriansMap)) {
    auroriansActions.setAuroriansMap(auroriansMapFromRemote);
  }

  return (
    <ConfigProvider prefixCls="sinsa" theme={theme}>
      <MyLayout defaultTerm={terms.firstTerm?.term}>
        <Outlet />
      </MyLayout>
    </ConfigProvider>
  );
}

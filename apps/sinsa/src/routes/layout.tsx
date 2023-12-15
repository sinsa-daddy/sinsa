import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { isEmpty } from 'lodash-es';
import { MyLayout } from '../components/MyLayout';
import type { LayoutLoaderData } from './layout.data';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';
import { useEffect } from 'react';
import LogoURL from '@/assets/wrench.svg';

const theme: ThemeConfig = {
  token: {
    colorPrimary: 'rgb(220, 89, 80)',
  },
};

const manifest = {
  name: '红油扳手作业站',
  start_url: './index.html',
  display: 'standalone',
  description: '您的荒典抄作业小帮手',
  icons: [
    {
      type: 'image/svg+xml',
      sizes: 'any',
      src: LogoURL,
      purpose: 'any',
    },
  ],
};

const stringManifest = JSON.stringify(manifest);

export default function Layout() {
  useEffect(() => {
    const blob = new Blob([stringManifest], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#manifest-pwa-placeholder')?.setAttribute('href', manifestURL);
  }, []);

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

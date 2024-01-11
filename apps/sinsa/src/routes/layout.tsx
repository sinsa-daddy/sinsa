import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import { ConfigProvider, theme, type ThemeConfig } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { isEmpty } from 'lodash-es';
import { TermSchema } from '@sinsa/schema';
import { useEffect, useMemo } from 'react';
import type { LayoutLoaderData } from './layout.data';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';
import { GlobalLayout } from '@/views/GlobalLayout';
import { ServiceWorkerUpdateBanner } from '@/components/ServiceWorkerUpdateBanner';
import { XFeatureBanner } from '@/components/XFeatureBanner';
import { redirectToUploadPageWhenGettingCode } from '@/services/feishu-oauth';
import { DARK_MODE_KEY } from '@/services/dark-mode';
import { DarkModel } from '@/models/dark';

const ANTD_PREFIX_CLASSNAME = 'sinsa' as const;

const Layout: React.FC = () => {
  const { terms: termsFromRemote, auroriansMap: auroriansMapFromRemote } =
    useLoaderData() as LayoutLoaderData;

  useEffect(() => {
    redirectToUploadPageWhenGettingCode();
  }, []);

  const [terms, termsActions] = useModel(TermsModel);
  const [aurorians, auroriansActions] = useModel(AuroriansModel);

  useEffect(() => {
    if (terms.terms.length === 0) {
      termsActions.setTerms(termsFromRemote.map(t => TermSchema.parse(t)));
    }

    if (isEmpty(aurorians.auroriansMap)) {
      auroriansActions.setAuroriansMap(auroriansMapFromRemote);
    }
  }, []);

  const [{ mode }] = useModel(DarkModel);
  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, mode);
  }, [mode]);

  const THEME = useMemo<ThemeConfig>(() => {
    let algorithm = theme.defaultAlgorithm;
    if (mode === 'dark') {
      algorithm = theme.darkAlgorithm;
    }
    return {
      token: {
        colorPrimary: 'rgb(220, 89, 80)',
        colorLink: 'rgb(220, 89, 80)',
      },
      algorithm,
    };
  }, [mode]);

  return (
    <ConfigProvider prefixCls={ANTD_PREFIX_CLASSNAME} theme={THEME}>
      <GlobalLayout>
        <ServiceWorkerUpdateBanner />
        <XFeatureBanner />
        <Outlet />
      </GlobalLayout>
    </ConfigProvider>
  );
};

export default Layout;

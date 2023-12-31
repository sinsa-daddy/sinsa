import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { isEmpty } from 'lodash-es';
import { TermSchema } from '@sinsa/schema';
import type { LayoutLoaderData } from './layout.data';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';
import { GlobalLayout } from '@/views/GlobalLayout';
import { ServiceWorkerUpdateBanner } from '@/components/ServiceWorkerUpdateBanner';
import { XFeatureBanner } from '@/components/XFeatureBanner';

const THEME: ThemeConfig = {
  token: {
    colorPrimary: 'rgb(220, 89, 80)',
  },
};

const ANTD_PREFIX_CLASSNAME = 'sinsa' as const;

const Layout: React.FC = () => {
  const { terms: termsFromRemote, auroriansMap: auroriansMapFromRemote } =
    useLoaderData() as LayoutLoaderData;

  const [terms, termsActions] = useModel(TermsModel);

  if (terms.terms.length === 0) {
    termsActions.setTerms(termsFromRemote.map(t => TermSchema.parse(t)));
  }

  const [aurorians, auroriansActions] = useModel(AuroriansModel);
  if (isEmpty(aurorians.auroriansMap)) {
    auroriansActions.setAuroriansMap(auroriansMapFromRemote);
  }

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

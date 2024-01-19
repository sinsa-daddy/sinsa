import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { isEmpty } from 'lodash-es';
import { TermSchema } from '@sinsa/schema';
import { useEffect } from 'react';
import type { LayoutLoaderData } from './layout.data';
import { Providers } from './providers';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';
import { GlobalLayout } from '@/views/GlobalLayout';
import { ServiceWorkerUpdateBanner } from '@/components/ServiceWorkerUpdateBanner';
import { XFeatureBanner } from '@/components/XFeatureBanner';
import { redirectToUploadPageWhenGettingCode } from '@/services/feishu-oauth';

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

  return (
    <Providers>
      <GlobalLayout>
        <ServiceWorkerUpdateBanner />
        <XFeatureBanner />
        <Outlet />
      </GlobalLayout>
    </Providers>
  );
};

export default Layout;

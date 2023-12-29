import { Outlet, useLoaderData } from '@modern-js/runtime/router';
import {
  ConfigProvider,
  type ThemeConfig,
  Alert,
  Typography,
  Button,
} from 'antd';
import { useModel } from '@modern-js/runtime/model';
import { isEmpty } from 'lodash-es';
import { useEffect, useState } from 'react';
import { TermSchema, TermType } from '@sinsa/schema';
import { MyLayout } from '../components/MyLayout';
import type { LayoutLoaderData } from './layout.data';
import styles from './layout.module.less';
import { TermsModel } from '@/models/terms';
import { AuroriansModel } from '@/models/aurorians';
import { useActualLatestTerm } from '@/services/service-worker';

const theme: ThemeConfig = {
  token: {
    colorPrimary: 'rgb(220, 89, 80)',
  },
};

export default function Layout() {
  const { terms: termsFromRemote, auroriansMap: auroriansMapFromRemote } =
    useLoaderData() as LayoutLoaderData;

  const [terms, termsActions] = useModel(TermsModel);
  const [alertTerm, setAlertTerm] = useState<TermType>();
  const actualLatestTerm = useActualLatestTerm();

  useEffect(() => {
    if (
      typeof terms.latestTerm?.term === 'number' &&
      typeof actualLatestTerm?.term === 'number'
    ) {
      if (actualLatestTerm.term > terms.latestTerm.term) {
        setAlertTerm(actualLatestTerm);
      }
    }
  }, [terms.latestTerm?.term, actualLatestTerm?.term]);

  if (terms.terms.length === 0) {
    termsActions.setTerms(termsFromRemote.map(t => TermSchema.parse(t)));
  }

  const [aurorians, auroriansActions] = useModel(AuroriansModel);
  if (isEmpty(aurorians.auroriansMap)) {
    auroriansActions.setAuroriansMap(auroriansMapFromRemote);
  }

  return (
    <ConfigProvider prefixCls="sinsa" theme={theme}>
      <MyLayout defaultTerm={terms.latestTerm?.term}>
        {alertTerm ? (
          <Alert
            className={styles.Alert}
            type="error"
            showIcon={false}
            banner
            message={`荒典已经更新至 ${alertTerm.term} 期，刷新页面后可选择`}
            action={
              <Typography.Link
                onClick={e => {
                  e.stopPropagation();
                  window.location.reload();
                }}
              >
                <Button size="small" type="primary">
                  立即刷新
                </Button>
              </Typography.Link>
            }
          />
        ) : null}

        <Outlet />
      </MyLayout>
    </ConfigProvider>
  );
}

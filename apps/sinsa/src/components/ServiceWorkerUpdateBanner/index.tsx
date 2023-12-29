import { useModel } from '@modern-js/runtime/model';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { TermType } from '@sinsa/schema';
import { Alert, Button, Typography } from 'antd';
import styles from './styles.module.less';
import { TermsModel } from '@/models/terms';
import { useActualLatestTerm } from '@/services/service-worker/use-actual-latest-term';

export const ServiceWorkerUpdateBanner: React.FC = () => {
  const [terms] = useModel(TermsModel);
  const actualLatestTerm = useActualLatestTerm();
  const [alertTerm, setAlertTerm] = useState<TermType>();

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

  if (alertTerm) {
    return (
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
    );
  }
  return null;
};

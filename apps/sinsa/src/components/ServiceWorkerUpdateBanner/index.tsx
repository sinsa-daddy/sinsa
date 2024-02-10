import { useModel } from '@modern-js/runtime/model';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { TermNextType } from '@sinsa/schema';
import { Alert, Button, Typography } from 'antd';
import { Tips } from '@icon-park/react';
import styles from './styles.module.less';
import { TermsModel } from '@/models/terms';
import { useActualLatestTerm } from '@/services/service-worker/use-actual-latest-term';

export const ServiceWorkerUpdateBanner: React.FC = () => {
  const [terms] = useModel(TermsModel);
  const actualLatestTerm = useActualLatestTerm();
  const [alertTerm, setAlertTerm] = useState<TermNextType>();

  useEffect(() => {
    if (
      typeof terms.latestTerm?.order === 'number' &&
      typeof actualLatestTerm?.order === 'number'
    ) {
      if (actualLatestTerm.order > terms.latestTerm.order) {
        setAlertTerm(actualLatestTerm);
      }
    }
  }, [terms.latestTerm?.order, actualLatestTerm?.order]);

  if (alertTerm) {
    return (
      <Alert
        className={styles.Alert}
        type="error"
        icon={<Tips />}
        banner
        message={`荒典已经更新至 ${alertTerm.order} 期，刷新页面后可选择`}
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

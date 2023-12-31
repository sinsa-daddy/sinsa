import type React from 'react';
import { Alert } from 'antd';
import { useLocation } from '@modern-js/runtime/router';
import styles from './styles.module.less';
import { X_FEATURE_FIELD } from './constants';

export const XFeatureBanner: React.FC = () => {
  const location = useLocation();

  if (location.search.includes(X_FEATURE_FIELD)) {
    return (
      <Alert
        className={styles.Alert}
        type="error"
        showIcon={false}
        banner
        message={`您正在使用内测版本的红油扳手作业站，当前版本包含实验性功能，未来可能进入正式版或被移除`}
      />
    );
  }
  return null;
};

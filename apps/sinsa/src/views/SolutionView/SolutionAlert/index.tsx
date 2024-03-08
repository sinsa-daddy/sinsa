import type { TermNextType } from '@sinsa/schema';
import React from 'react';
import { Alert } from 'antd';
import { ALERT_MAP, COMMON_ALERT_PROPS } from './constants';

interface SolutionAlertProps {
  currentTerm: TermNextType;
}

export const SolutionAlert = React.memo<SolutionAlertProps>(
  ({ currentTerm }) => {
    const targetProps = ALERT_MAP.get(currentTerm.term_id);
    if (!targetProps) {
      return null;
    }
    return <Alert {...COMMON_ALERT_PROPS} {...targetProps} />;
  },
  (a, b) => a.currentTerm.term_id === b.currentTerm.term_id,
);

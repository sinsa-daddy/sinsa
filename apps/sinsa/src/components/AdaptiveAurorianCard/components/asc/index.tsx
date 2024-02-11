import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.less';

interface AscProps {
  rairty: number;
  asc: number;
}

export const IconAsc = React.memo<AscProps>(
  ({ rairty }) => {
    return (
      <div
        className={clsx(
          styles.Asc,
          rairty >= 4 ? styles.Icon3of3 : styles.Icon2of2,
        )}
      ></div>
    );
  },
  (a, b) => a.asc === b.asc && a.rairty === b.rairty,
);

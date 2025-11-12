import React, { ReactNode } from 'react';
import cx from 'classnames';

import { columnStyles } from './TransactionsTable';
import styles from './TransactionsTableSkeleton.module.scss';
import { useTransactionsLoading } from 'repositories/transactionsRepository';

interface TransactionsTableSkeletonProps {
  children: ReactNode;
}

export const TransactionsTableSkeleton = ({ children }: TransactionsTableSkeletonProps): JSX.Element => {
  const loading = useTransactionsLoading();

  if (!loading) return <>{children}</>;

  const skeletonRows = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className={styles.root}>
      <div className={styles.tableHeader}>
        <div className={cx(styles.column, columnStyles.date)}>Date</div>
        <div className={cx(styles.column, columnStyles.payee)}>Payee</div>
        <div className={cx(styles.column, columnStyles.memo)}>Memo</div>
        <div className={cx(styles.column, columnStyles.amount)}>Amount</div>
      </div>
      {skeletonRows.map((index) => (
        <div key={index} className={styles.skeletonRow}>
          <div className={cx(styles.column, columnStyles.date)}>
            <div className={styles.skeletonText} />
          </div>
          <div className={cx(styles.column, columnStyles.payee)}>
            <div className={styles.skeletonText} />
          </div>
          <div className={cx(styles.column, columnStyles.memo)}>
            <div className={styles.skeletonText} />
          </div>
          <div className={cx(styles.column, columnStyles.amount)}>
            <div className={styles.skeletonText} />
          </div>
        </div>
      ))}
    </div>
  );
};

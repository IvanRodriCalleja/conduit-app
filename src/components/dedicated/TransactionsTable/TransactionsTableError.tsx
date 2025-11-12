import React, { ReactNode } from 'react';

import Button from 'components/core/Button/Button';
import styles from './TransactionsTableError.module.scss';
import { useTransactionsError } from 'repositories/transactionsRepository';

interface TransactionsTableErrorProps {
  children: ReactNode;
}

export const TransactionsTableError = ({ children }: TransactionsTableErrorProps): JSX.Element => {
  const { error, retry } = useTransactionsError();

  if (!error) return <>{children}</>;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorMessage}>
        <h3>Failed to load transactions</h3>
        <p>{error}</p>
        <Button label="Retry" onClick={retry} variant="primary" />
      </div>
    </div>
  );
};


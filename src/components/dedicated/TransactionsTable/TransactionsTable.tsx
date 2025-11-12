import React, { FC, useEffect } from 'react';
import cx from 'classnames';

import RecordRow from 'components/dedicated/RecordRow/RecordRow';
import { useTransactions } from 'repositories/transactionsRepository';

import { TransactionsTableSkeleton } from './TransactionsTableSkeleton';
import { TransactionsTableError } from './TransactionsTableError';
import styles from './TransactionsTable.module.scss';

export const columnStyles = {
  amount: styles['column--amount'],
  payee: styles['column--payee'],
  date: styles['column--date'],
  memo: styles['column--memo'],
};

const TransactionsTable: FC = () => {
  const { transactions, load } = useTransactions();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <TransactionsTableSkeleton>
      <TransactionsTableError>
        <div className={styles.root}>
          <div className={styles.tableHeader}>
            <div className={cx(styles.column, columnStyles.date)}>Date</div>
            <div className={cx(styles.column, columnStyles.payee)}>Payee</div>
            <div className={cx(styles.column, columnStyles.memo)}>Memo</div>
            <div className={cx(styles.column, columnStyles.amount)}>Amount</div>
          </div>
          {transactions.map((transaction) => (
            <RecordRow
              key={transaction.id}
              columnStyles={columnStyles}
              transactionRecord={transaction}
            />
          ))}
        </div>
      </TransactionsTableError>
    </TransactionsTableSkeleton>
  );
};

export default TransactionsTable;

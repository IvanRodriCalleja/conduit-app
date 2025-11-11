import React, { FC } from 'react';
import cx from 'classnames';

import RecordRow from 'components/dedicated/RecordRow/RecordRow';

import styles from './TransactionsTable.module.scss';

export const columnStyles = {
  amount: styles['column--amount'],
  payee: styles['column--payee'],
  date: styles['column--date'],
};

const exampleRecord = {
  amount: 100,
  id: 'J3KaU271',
  memo: 'Some memo',
  payee: 'ABC General Store',
  timestamp: 1655220435730,
};

const TransactionsTable: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.tableHeader}>
        <div className={cx(styles.column, columnStyles.date)}>Date</div>
        <div className={cx(styles.column, columnStyles.payee)}>Payee</div>
        <div className={cx(styles.column, columnStyles.amount)}>Amount</div>
      </div>
      <RecordRow
        columnStyles={columnStyles}
        transactionRecord={exampleRecord}
      />
    </div>
  );
};

export default TransactionsTable;

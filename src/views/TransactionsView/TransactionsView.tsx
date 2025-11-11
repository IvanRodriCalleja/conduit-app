import React, { ReactElement } from 'react';

import AddRecordForm from 'components/dedicated/AddRecordForm/AddRecordForm';
import TransactionsTable from 'components/dedicated/TransactionsTable/TransactionsTable';

import styles from './TransactionsView.module.scss';

const TransactionsView = (): ReactElement => {
  return (
    <div className={styles.root}>
      <TransactionsTable />
      <AddRecordForm />
    </div>
  );
};

export default TransactionsView;

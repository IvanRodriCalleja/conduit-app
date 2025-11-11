import React, { ReactElement } from 'react';

import Header from 'components/core/Header/Header';
import TransactionsView from 'views/TransactionsView/TransactionsView';

import styles from './DashboardLayout.module.scss';

const DashboardLayout = (): ReactElement => (
  <div className={styles.root}>
    <Header />
    <TransactionsView />
  </div>
);

export default DashboardLayout;

import React, { FC } from 'react';
import cx from 'classnames';

import { columnStyles } from 'components/dedicated/TransactionsTable/TransactionsTable';
import Button from 'components/core/Button/Button';

import styles from './AddRecordForm.module.scss';

const AddRecordForm: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>Add record</div>
      <div className={styles.form}>
        <div className={styles.fields}>
          <div className={cx(styles.column, columnStyles.date)}>
            <input placeholder="Date" />
          </div>
          <div className={cx(styles.column, columnStyles.payee)}>
            <input placeholder="Payee" />
          </div>
          <div
            className={cx(
              styles.column,
              styles['column--amount'],
              columnStyles.amount,
            )}
          >
            <input placeholder="Amount" />
          </div>
        </div>
        <Button
          className={styles.buttonAdd}
          label="Add"
          padding="small"
          width="auto"
        />
      </div>
    </div>
  );
};

export default AddRecordForm;

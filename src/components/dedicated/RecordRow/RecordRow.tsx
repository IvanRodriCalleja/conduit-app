import React, { FC } from 'react';
import cx from 'classnames';

import Currency from 'components/core/Currency/Currency';

import { RecordRowProps } from './types';
import styles from './RecordRow.module.scss';

const RecordRow: FC<RecordRowProps> = ({ columnStyles, transactionRecord }) => {
  const { amount, payee, timestamp } = transactionRecord;

  return (
    <div className={styles.root}>
      <div className={cx(styles.column, columnStyles.date)}>{timestamp}</div>
      <div className={cx(styles.column, columnStyles.payee)}>{payee}</div>
      <div className={cx(styles.column, columnStyles.amount)}>
        <Currency amount={amount} className={styles.currency} />
      </div>
    </div>
  );
};

export default RecordRow;

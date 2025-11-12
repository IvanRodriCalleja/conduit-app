import React, { FC, memo } from 'react';
import cx from 'classnames';

import Currency from 'components/core/Currency/Currency';
import { formatDate } from 'utils/dateFormat';

import { RecordRowProps } from './types';
import styles from './RecordRow.module.scss';

const RecordRow: FC<RecordRowProps> = memo(({ columnStyles, transactionRecord }) => {
  const { amount, payee, timestamp, memo } = transactionRecord;

  const isNegative = amount < 0;

  return (
    <div className={styles.root}>
      <div className={cx(styles.column, columnStyles.date)}>{formatDate(timestamp)}</div>
      <div className={cx(styles.column, columnStyles.payee)}>{payee}</div>
      <div className={cx(styles.column, columnStyles.memo)}>{memo || ''}</div>
      <div className={cx(styles.column, columnStyles.amount)}>
        <Currency
          amount={amount}
          className={cx(styles.currency, { [styles['currency--negative']]: isNegative })}
        />
      </div>
    </div>
  );
});

export default RecordRow;

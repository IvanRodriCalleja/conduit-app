import React, { FC, memo } from 'react';
import cx from 'classnames';

import Currency from 'components/core/Currency/Currency';
import { formatDate } from 'utils/dateFormat';

import { RecordRowProps } from './types';
import styles from './RecordRow.module.scss';

const RecordRow: FC<RecordRowProps> = memo(({ columnStyles, transactionRecord, isNew = false }) => {
  const { amount, payee, timestamp, memo } = transactionRecord;

  const isNegative = amount < 0;

  return (
    <div className={cx(styles.root, { [styles['root--highlighted']]: isNew })}>
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

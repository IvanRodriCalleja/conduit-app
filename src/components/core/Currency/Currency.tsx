import React, { FC } from 'react';
import cx from 'classnames';

import { buildCurrencyString } from 'utils/currency';

import { CurrencyProps } from './types';
import styles from './Currency.module.scss';

const Currency: FC<CurrencyProps> = ({
  amount, className, currency = 'USD', dataTest, hideDecimal = false,
}) => (
  <div className={cx(styles.root, className)}>
    <span className={styles.amount} data-test={dataTest}>
      {buildCurrencyString(amount, hideDecimal)}
    </span>
    <span className={styles.currency}>{currency}</span>
  </div>
);

export default Currency;

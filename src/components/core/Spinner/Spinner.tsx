import React, { FC } from 'react';
import cx from 'classnames';

import { SpinnerProps } from './types';
import styles from './Spinner.module.scss';

const Spinner: FC<SpinnerProps> = ({
  className, dataTest, size = 1.8, sizeUnit = 'rem',
}) => {
  const spinnerStyles = {
    height: `${size}${sizeUnit}`,
    width: `${size}${sizeUnit}`,
  };

  return (
    <div
      key="spinner"
      className={cx(styles.spinner, className)}
      data-test={dataTest}
      style={spinnerStyles}
    />
  );
};

export default Spinner;

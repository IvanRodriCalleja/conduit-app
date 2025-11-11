import { Link } from 'react-router-dom';
import React, { FC, Fragment } from 'react';
import cx from 'classnames';

import Spinner from 'components/core/Spinner/Spinner';

import { ButtonProps } from './types';
import styles from './Button.module.scss';

const Button: FC<ButtonProps> = ({
  children,
  className,
  contentPosition = 'center',
  dataTest,
  href,
  Icon,
  iconPosition = 'left',
  iconSize = 'regular',
  isDisabled = false,
  isLoading,
  label,
  labelMobile,
  onClick,
  padding = 'normal',
  rel,
  target,
  to,
  type = 'button',
  variant = 'primary',
  width = 'normal',
}) => {
  const filteredProps = {};
  const isActionDisabled = isDisabled || isLoading;

  let Component;
  if (to) {
    Component = Link;
    Object.assign(filteredProps, { to });
  } else if (href) {
    Component = 'a';
    Object.assign(filteredProps, { href, rel, target });
  } else {
    Component = 'button';
    Object.assign(filteredProps, {
      disabled: isActionDisabled,
      type,
    });
  }

  return (
    <Component
      className={cx(
        styles.button,
        styles[`variant--${variant}`],
        styles[`contentPosition--${contentPosition}`],
        styles[`padding--${padding}`],
        styles[`width--${width}`],
        variant === 'icon' && styles[`iconSize--${iconSize}`],
        isDisabled && styles.isDisabled,
        isLoading && styles.isLoading,
        className,
      )}
      data-test={dataTest}
      disabled={isDisabled || isLoading}
      onClick={isActionDisabled ? () => {} : onClick}
      {...filteredProps}
    >
      {isLoading ? (
        <Spinner className={styles.spinner} dataTest="Button__spinner" />
      ) : (
        <Fragment>
          {Icon && (
            <span
              className={cx(
                styles.iconContainer,
                cx(
                  styles[`iconPosition--${iconPosition}`],
                  label && styles.isLabel,
                ),
              )}
            >
              {Icon}
            </span>
          )}
          <span
            className={cx(
              styles.label,
              styles.labelDesktop,
              !labelMobile && styles.isOnlyLabel,
            )}
          >
            {label}
            {children}
          </span>
          {labelMobile && (
            <span className={cx(styles.label, styles.labelMobile)}>
              {labelMobile}
            </span>
          )}
        </Fragment>
      )}
    </Component>
  );
};

export default Button;

import React, { ReactElement } from 'react';

import styles from './Header.module.scss';

const Header = (): ReactElement => (
  <header className={styles.root}>
    <div className={styles.container}>Transactions Tracker</div>
  </header>
);

export default Header;

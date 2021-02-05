/**
 *
 * PreOrderBanner
 *
 */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.css';

export function PreOrderBanner() {
  const [isWindow, setIsWindows] = useState(false);
  useEffect(() => {
    setIsWindows(navigator?.appVersion?.indexOf('Win') !== -1);
  }, []);

  return (
    <div className="row mb-5">
      <a
        href="https://token.sovryn.app"
        className={classNames(styles.banner, isWindow && styles.windows)}
        rel="noreferrer noopener"
        target="_blank"
      >
        <span className="sr-only">Join Wait-list</span>
      </a>
    </div>
  );
}

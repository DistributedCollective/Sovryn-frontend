/**
 *
 * PreOrderBanner
 *
 */
import React from 'react';
import classNames from 'classnames';
import styles from './index.module.css';

export function PreOrderBanner() {
  return (
    <div className="row mb-5">
      <a
        href="https://token.sovryn.app"
        className={classNames(styles.banner, styles.windows)}
        rel="noreferrer noopener"
        target="_blank"
      >
        <span className="sr-only">Join Wait-list</span>
      </a>
    </div>
  );
}

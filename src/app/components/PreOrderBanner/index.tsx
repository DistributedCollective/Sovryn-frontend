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
    <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-12">
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

/**
 *
 * PreOrderBanner
 *
 */
import React from 'react';
import styles from './index.module.css';

export function PreOrderBanner() {
  return (
    <div className="row mb-5">
      <a
        href="https://token.sovryn.app"
        className={styles.banner}
        rel="noreferrer noopener"
        target="_blank"
      >
        <span className="sr-only">Join Wait-list</span>
      </a>
    </div>
  );
}

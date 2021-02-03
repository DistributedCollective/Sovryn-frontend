/**
 *
 * PreOrderBanner
 *
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

export function PreOrderBanner() {
  return (
    <div className="row mb-5">
      <Link to="/genesis" className={styles.banner}>
        <span className="sr-only">Join Wait-list</span>
      </Link>
    </div>
  );
}

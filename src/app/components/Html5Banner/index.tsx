/**
 *
 * Html5Banner
 *
 */
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Html5Banner.module.css';

interface Props {}

export function Html5Banner(props: Props) {
  return (
    <div
      className={classNames('mx-auto my-5 position-relative', styles.banner)}
    >
      <iframe
        src="/banners/index960x90.html"
        className={classNames(
          styles.iframe,
          styles.banner,
          'd-none d-lg-block d-xl-none',
        )}
        title="Sale"
      />
      <iframe
        src="/banners/index1140x90.html"
        className={classNames(
          styles.iframe,
          styles.banner,
          'd-none d-xl-block',
          styles.dXxlNone,
        )}
        title="Sale"
      />
      <iframe
        src="/banners/index1440x90.html"
        className={classNames(
          styles.iframe,
          styles.banner,
          'd-none',
          styles.dXxlBlock,
        )}
        title="Sale"
      />
      <Link to="/genesis" className={classNames(styles.link, styles.banner)}>
        <span className="sr-only">Open this add.</span>
      </Link>
    </div>
  );
}

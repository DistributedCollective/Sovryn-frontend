import React, { useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import styles from './SaleBanner.module.scss';
import samurai from './assets/banner-samurai.svg';

export function SaleBanner() {
  const [show, setShow] = useState(true);

  const closeBanner = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.bannerContainer}>
      <div className={classNames(styles.banner, 'tw-py-4')}>
        <div className={styles.infoContainer}>
          <h2
            className={classNames(
              styles.titleContainer,
              'tw-uppercase tw-black-font',
            )}
          >
            <>SOV* Genesis Pre-Order is Over!</>
          </h2>
          <div className={styles.subInfoContainer}>
            <p className={classNames(styles.subInfoText, 'tw-black-font')}>
              Sold out!
            </p>
          </div>
          <div className={styles.buttonContainer}>
            <Link
              className={classNames(
                styles.button,
                styles.buttonNav,
                styles.buttonBlack,
                styles.buttonWhite,
                styles.buttonContainer,
              )}
              to="/genesis"
            >
              <span className="tw-whitespace-nowrap">Learn More</span>
            </Link>
          </div>
        </div>
        <div className={styles.pictureContainer}>
          <img
            className={styles.bannerSamurai}
            src={samurai}
            alt="banner-samurai"
          />
        </div>
        <div className={styles.closeButtonContainer}>
          <Button
            minimal
            color="black"
            className="tw-float-right"
            onClick={() => {
              closeBanner();
            }}
          >
            <Icon icon="cross" color="black" iconSize={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

import { usePageViews } from 'app/hooks/useAnalytics';

import WalletConnector from '../../containers/WalletConnector';
import { LanguageToggle } from '../LanguageToggle';
import styles from './index.module.scss';
import { ReactComponent as SovLogo } from 'assets/images/sovryn-logo-labs.svg';
import { ReactComponent as ArrowBack } from 'assets/images/genesis/arrow_back.svg';

export function HeaderLabs() {
  usePageViews();

  return (
    <header className={styles.header}>
      <div className="tw-container tw-flex tw-justify-between tw-items-center tw-py-1.5 tw-px-2 xl:tw-pr-8 tw-mx-auto tw-text-black">
        <div className="tw-flex tw-items-start tw-w-1/4">
          <Link to="/">
            <ArrowBack className={styles.backArrow} />
          </Link>
        </div>
        <div className="tw-w-1/2 tw-flex tw-flex-row tw-items-center tw-justify-center">
          <div className="tw-mr-5 2xl:tw-mr-20">
            <SovLogo className={styles.logo} />
          </div>
        </div>
        <div className="tw-w-1/4 tw-flex tw-justify-end tw-items-center">
          <div className="xl:tw-mr-4">
            <LanguageToggle innerClasses="tw-text-black tw-h-8" />
          </div>
          <WalletConnector lightMode hideConnectButton />
        </div>
      </div>
    </header>
  );
}

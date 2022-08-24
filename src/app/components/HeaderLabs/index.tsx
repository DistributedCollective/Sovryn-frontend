import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import WalletConnector from '../../containers/WalletConnector';
import styles from './index.module.scss';
import { ReactComponent as SovLogo } from 'assets/images/sovryn-logo-labs.svg';
import { ReactComponent as ArrowBack } from 'assets/images/genesis/arrow_back.svg';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export type HeaderLabsProps = {
  helpLink?: string;
  menus?: React.ReactNode;
};

export const HeaderLabs: React.FC<HeaderLabsProps> = ({ menus, helpLink }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const linkBackUrl = useMemo(
    () =>
      location.pathname === '/perpetuals/competition' ? '/perpetuals' : '/',
    [location.pathname],
  );

  return (
    <header className={styles.header}>
      <div className="tw-container tw-flex tw-justify-between tw-items-center tw-py-1.5 tw-px-2 xl:tw-pr-8 tw-mx-auto tw-text-black">
        <div className="tw-w-12 xl:tw-w-1/4 tw-flex tw-items-start">
          <Link to={linkBackUrl}>
            <ArrowBack className={styles.backArrow} />
          </Link>
        </div>
        <div className="tw-w-full xl:tw-w-1/2 tw-flex tw-flex-row tw-items-center tw-justify-start xl:tw-justify-center">
          <div className="tw-mr-5 2xl:tw-mr-20">
            <SovLogo className={styles.logo} />
          </div>
        </div>
        <div className="tw-w-full 2xl:tw-w-1/2 tw-flex tw-justify-end tw-items-center">
          <div className="tw-flex tw-mr-4 tw-items-center">{menus}</div>
          {helpLink && (
            <a
              className="tw-mr-2 xl:tw-mr-4 tw-text-base tw-text-black"
              href={helpLink}
              target="_blank"
              rel="noreferrer"
            >
              {t(translations.mainMenu.help)}
            </a>
          )}
          {/* Hidden until we have translations */}
          {/* <div className="xl:tw-mr-4">
            <LanguageToggle innerClasses="tw-text-black tw-h-8" />
          </div> */}
          <WalletConnector lightMode hideConnectButton />
        </div>
      </div>
    </header>
  );
};

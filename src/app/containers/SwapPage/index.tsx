import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';

import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useAccount } from '../../hooks/useAccount';
import { SwapFormContainer } from '../SwapFormContainer';
import { SwapHistory } from '../SwapHistory';

import styles from './index.module.scss';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const account = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.swap.title)}</title>
        <meta name="description" content={t(translations.swap.meta)} />
      </Helmet>
      <div className={classNames(styles.swapPage, 'tw-container')}>
        <div>
          <SwapFormContainer />
        </div>
        <div>
          <div className={styles.swapHistoryTableContainer}>
            {!account ? (
              <SkeletonRow
                loadingText={t(translations.topUpHistory.walletHistory)}
                className="tw-mt-2"
              />
            ) : (
              <SwapHistory />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/**
 *
 * RewardPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount, useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { RewardForm } from './components/RewardForm'
import { Tab } from './components/Tab';

// import { ClaimForm } from './components/RewardBox';
// import { ClaimForm } from './components/ClaimForm';
// import { HistoryTable } from './components/HistoryTable';

export function RewardPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(0);
  const [activeHistory, setActiveHistory] = useState(0);
  const connected = useIsConnected();
  const account = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.rewardPage.meta.description)}
        />
      </Helmet>

      <Header />

      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          {/* <ClaimForm address={userAddress} /> */}
          <div className="tw-flex tw-w-1/2 tw-flex-row tw-items-center tw-justify-start">
            <div className="tw-w-full">
              <Tab
                text={t(translations.walletPage.tabs.userAssets)}
                amount="21.274693 SOV"
                active={activeAssets === 0}
                onClick={() => setActiveAssets(0)}
              />
            </div>
            <div className="tw-w-full">
              <Tab
                text={t(translations.walletPage.tabs.vestedAssets)}
                active={activeAssets === 1}
                onClick={() => setActiveAssets(1)}
                amount="32.274693 SOV"
              />
            </div>
            <div className="tw-w-full">
              <Tab
                text={t(translations.walletPage.tabs.userNFTS)}
                active={activeAssets === 2}
                onClick={() => setActiveAssets(2)}
                amount="0.02918284 RBTC"
              />
            </div>
          </div>
          <div className="tw-flex-1 tw-w-1/2 tw-flex tw-justify-center tw-align-center">
            {activeAssets === 0 && <RewardForm />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

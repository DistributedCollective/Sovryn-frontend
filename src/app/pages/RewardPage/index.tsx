/**
 *
 * RewardPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { useAccount, useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { Tab } from '../../components/Tab';

// import { ClaimForm } from './components/RewardBox';
// import { ClaimForm } from './components/ClaimForm';

export function RewardPage() {
  const { t } = useTranslation();
  const account = useAccount();
  const connected = useIsConnected();

  const [activeAssets, setActiveAssets] = useState(0);
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

      <div className="tw-flex tw-flex-row tw-items-center tw-justify-center">
        <div className="tw-mr-2 tw-ml-2">
          <Tab
            text={t(translations.walletPage.tabs.userAssets)}
            active={true}
            onClick={() => setActiveAssets(0)}
          />
        </div>
        <div className="tw-mr-2 tw-ml-2">
          <Tab
            text={t(translations.walletPage.tabs.vestedAssets)}
            active={false}
            onClick={() => setActiveAssets(1)}
          />
        </div>
        <div>
          <Tab
            text={t(translations.walletPage.tabs.userNFTS)}
            active={activeAssets === 2}
            onClick={() => setActiveAssets(2)}
          />
        </div>
        {connected && account ? (
          <div className="tw-grid tw-gap-8 tw-grid-cols-12">
            <div className="tw-col-span-12 tw-mt-2">
              {/* {activeAssets === 0 && <UserAssets />}
              {activeAssets === 1 && <VestedAssets />}
              {activeAssets === 2 && <SovGenerationNFTS />} */}
            </div>
          </div>
        ) : (
          <div className="tw-grid tw-gap-8 tw-grid-cols-12">
            <div className="tw-col-span-12">
              <SkeletonRow
                loadingText={t(translations.topUpHistory.walletHistory)}
                className="tw-mt-2"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

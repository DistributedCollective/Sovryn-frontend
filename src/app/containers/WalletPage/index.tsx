import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../locales/i18n';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { SovGenerationNFTS } from '../../components/SovGenerationNFTS';
import { Tab } from '../../components/Tab';
import { UserAssets } from '../../components/UserAssets';
import { VestedAssets } from '../../components/UserAssets/VestedAssets';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { TopUpHistory } from './components/TopUpHistory';
import { SwapHistory } from '../SwapHistory';
import { VestedHistory } from '../VestedHistory';
import { OriginClaimBanner } from './components/OriginClaimBanner';

import './_overlay.scss';

export function WalletPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(0);
  const [activeHistory, setActiveHistory] = useState(0);
  const connected = useIsConnected();
  const account = useAccount();
  return (
    <>
      <Helmet>
        <title>{t(translations.walletPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.walletPage.meta.description)}
        />
      </Helmet>
      <Header />

      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-4">
        <OriginClaimBanner />
      </div>

      <div
        className="tw-container tw-mx-auto tw-px-4"
        style={{ maxWidth: 1200 }}
      >
        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-mb-3">
          <h2 className="tw-flex-shrink-0 tw-flex-grow-0 tw-mb-2 ">
            {t(translations.userAssets.meta.title)}
          </h2>
        </div>
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-start">
          <div className="tw-mr-2 tw-ml-2">
            <Tab
              text={t(translations.walletPage.tabs.userAssets)}
              active={activeAssets === 0}
              onClick={() => setActiveAssets(0)}
            />
          </div>
          <div className="tw-mr-2 tw-ml-2">
            <Tab
              text={t(translations.walletPage.tabs.vestedAssets)}
              active={activeAssets === 1}
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
        </div>
        {connected && account ? (
          <div className="tw-grid tw-gap-8 tw-grid-cols-12">
            <div className="tw-col-span-12 tw-mt-2">
              {activeAssets === 0 && <UserAssets />}
              {activeAssets === 1 && <VestedAssets />}
              {activeAssets === 2 && <SovGenerationNFTS />}
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
      {connected && account && (
        <div className="tw-container tw-mt-12">
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-start">
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.topUpHistory.meta.title)}
                active={activeHistory === 0}
                onClick={() => setActiveHistory(0)}
              />
            </div>
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.swapHistory.title)}
                active={activeHistory === 1}
                onClick={() => setActiveHistory(1)}
              />
            </div>
            <div className="tw-mr-2 tw-ml-2">
              <Tab
                text={t(translations.vestedHistory.title)}
                active={activeHistory === 2}
                onClick={() => setActiveHistory(2)}
              />
            </div>
          </div>
          <div className="tw-w-full">
            {activeHistory === 0 && <TopUpHistory />}
            {activeHistory === 1 && <SwapHistory />}
            {activeHistory === 2 && <VestedHistory />}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

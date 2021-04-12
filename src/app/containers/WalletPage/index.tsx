/**
 *
 * WalletPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import WalletConnector from '../../containers/WalletConnector';
import { UserAssets } from '../../components/UserAssets';
import { SovGenerationNFTS } from '../../components/SovGenerationNFTS';
import { Tab } from '../../components/Tab';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { VestedAssets } from '../../components/UserAssets/VestedAssets';
import { OriginClaimBanner } from './components/OriginClaimBanner';
import { TopUpHistory } from '../FastBtcDialog/components/TopUpHistory';
import { SwapHistory } from '../../containers/SwapHistory';

export function WalletPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(0);
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

      <div className="container mb-5">
        <OriginClaimBanner />
      </div>

      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="d-flex flex-wrap align-items-center justify-content-center mb-3">
          <h2 className="flex-shrink-0 flex-grow-0 mb-2 ">
            {t(translations.userAssets.meta.title)}
          </h2>
          {connected && account && (
            <div className="w-100 text-center">
              <WalletConnector simpleView={true} />
            </div>
          )}
        </div>
        <div className="d-flex flex-row align-items-center justify-content-start">
          <div className="mr-2 ml-2">
            <Tab
              text={t(translations.walletPage.tabs.userAssets)}
              active={activeAssets === 0}
              onClick={() => setActiveAssets(0)}
            />
          </div>
          <div className="mr-2 ml-2">
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
          <div className="row">
            <div className="col-12 mt-2">
              {activeAssets === 0 && <UserAssets />}
              {activeAssets === 1 && <VestedAssets />}
              {activeAssets === 2 && <SovGenerationNFTS />}
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 mt-2">
              <SkeletonRow
                loadingText={t(translations.topUpHistory.walletHistory)}
              />
            </div>
          </div>
        )}
      </div>
      {connected && account && (
        <div className="container mt-5">
          <div className="w-100">
            <TopUpHistory />
            <SwapHistory />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

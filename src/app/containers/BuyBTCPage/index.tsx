/**
 *
 * BuyBTCPage
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
import { Tab } from '../../components/Tab';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { OriginClaimBanner } from '../WalletPage/components/OriginClaimBanner';
import transak from './components/transak';

export function BuyBTCPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(0);
  const connected = useIsConnected();
  const account = useAccount();
  return (
    <>
      <Helmet>
        <title>{t(translations.buyBTCPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.buyBTCPage.meta.description)}
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
        {connected && account ? (
          <div className="row">
            <div className="col-12 mt-2">{transak}</div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 mt-2"></div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

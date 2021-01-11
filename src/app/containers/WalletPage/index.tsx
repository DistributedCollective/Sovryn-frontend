/**
 *
 * WalletPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Text } from '@blueprintjs/core';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { prettyTx } from '../../../utils/helpers';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { UserAssets } from '../../components/UserAssets';
import { TopUpHistory } from '../../components/TopUpHistory';
import { SovGenerationNFTS } from '../../components/SovGenerationNFTS';
import { Tab } from '../../components/Tab';

export function WalletPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(true);
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
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center mb-3">
          <h2 className="flex-shrink-0 flex-grow-0 mr-3">
            {t(translations.userAssets.meta.title)}
          </h2>
          {connected && account && (
            <div className="w-100 text-center">
              <Text ellipsize>{prettyTx(account)}</Text>
            </div>
          )}
        </div>
        <div className="d-flex flex-row align-items-center justify-content-start">
          <div className="mr-3">
            <Tab
              text="My assets"
              active={activeAssets}
              onClick={() => setActiveAssets(true)}
            />
          </div>
          <div className="mr-3">
            <Tab
              text="NFTS"
              active={!activeAssets}
              onClick={() => setActiveAssets(false)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 mt-5">
            {activeAssets ? (
              <>
                <UserAssets />
                <TopUpHistory />
              </>
            ) : (
              <SovGenerationNFTS />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

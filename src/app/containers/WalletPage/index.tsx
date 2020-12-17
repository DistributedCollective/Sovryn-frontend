/**
 *
 * WalletPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { UserAssets } from '../../components/UserAssets';
import { TopUpHistory } from '../../components/TopUpHistory';

export function WalletPage() {
  const { t } = useTranslation();
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
        <UserAssets />
        <TopUpHistory />
      </div>
      <Footer />
    </>
  );
}

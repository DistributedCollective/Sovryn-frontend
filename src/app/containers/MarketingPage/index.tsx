/**
 *
 * EmailOptInSuccessPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';

const s = translations.tradingPage;

export function MarketingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <Header />
      <div className="tw-container tw-my-12 tw-py-12">
        <h1>Marketing Page</h1>
      </div>
      <Footer />
    </>
  );
}

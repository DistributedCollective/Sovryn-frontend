/**
 *
 * TradingPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { translations } from 'locales/i18n';
import { InfoBar } from './components/InfoBar';
import { EscrowForm } from './components/EscrowForm';
import { PoolTable } from './components/PoolTable';
import { DescriptionBlock } from './components/DescriptionBlock';

export function EscrowPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t(translations.escrowPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.escrowPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat">
        <div className="w-100 d-flex flex-col flex-lg-row align-items-lg-start">
          <div className="w-100">
            <InfoBar />
            <DescriptionBlock />
          </div>
          <EscrowForm />
        </div>

        <div className="mt-5">
          <PoolTable />
        </div>
      </div>
      <Footer />
    </>
  );
}

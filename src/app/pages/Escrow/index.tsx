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
      <div className="tw-container tw-mt-12 tw-font-body">
        <div className="tw-w-full tw-flex tw-flex-col lg:tw-flex-row lg:tw-align-start">
          <div className="tw-w-full">
            <InfoBar />
            <DescriptionBlock />
          </div>
          <EscrowForm />
        </div>

        <div className="tw-mt-12">
          <PoolTable />
        </div>
      </div>
      <Footer />
    </>
  );
}

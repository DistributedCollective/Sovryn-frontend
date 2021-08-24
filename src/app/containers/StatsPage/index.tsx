/**
 *
 * StatsPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingVolume } from './components/TradingVolume';
import { TVL } from './components/TVL';
import { AmmBalance } from './components/AmmBalance';
import { LendingStats } from './components/LendingStats';

export function StatsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main>
        <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12">
          <h1 className="tw-text-center tw-w-full">
            {t(translations.statsPage.titles.transactionVolume)}
          </h1>
          <div className="tw-ty-5">
            <TradingVolume />
          </div>
          <h1 className="tw-text-center tw-w-full">
            {t(translations.statsPage.titles.tvl)}
          </h1>
          <div className="sovryn-border sovryn-table tw-p-3 tw-mt-5 tw-mb-5">
            <TVL />
          </div>
          <h1 className="tw-text-center tw-w-full">
            {t(translations.statsPage.titles.lending)}
          </h1>
          <div className="sovryn-border tw-p-4 tw-mt-12 tw-mb-12 tw-overflow-auto">
            <LendingStats />
          </div>
          <h1 className="tw-text-center tw-w-full">
            {t(translations.statsPage.ammpool.title)}
          </h1>
          <div className="sovryn-border sovryn-table tw-p-4 tw-mt-12 tw-mb-12 tw-overflow-auto">
            <AmmBalance />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

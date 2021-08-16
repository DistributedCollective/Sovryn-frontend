/**
 *
 * StatsPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { translations } from 'locales/i18n';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { StatsRow } from '../../components/StatsRow';
import { TradingVolume } from './components/TradingVolume';
import { TVL } from './components/TVL';
import { AmmBalance } from './components/AmmBalance';

export function StatsPage() {
  const { t } = useTranslation();
  const assets = LendingPoolDictionary.assetList();
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
          <div className="sovryn-border sovryn-table tw-p-4 tw-mt-12 tw-mb-12 tw-overflow-auto">
            <table className="tw-w-full">
              <thead>
                <tr>
                  <th>{t(translations.statsPage.asset)}</th>
                  <th className="tw-text-right">
                    {t(translations.statsPage.totalAssetSupplied)}
                  </th>
                  <th className="tw-text-right">
                    {t(translations.statsPage.totalAssetBorrowed)}
                  </th>
                  <th className="tw-text-right">
                    {t(translations.statsPage.totalAvailable)}
                  </th>
                  <th className="tw-text-right">
                    {t(translations.statsPage.supplyAPR)}
                  </th>
                  <th className="tw-text-right">
                    {t(translations.statsPage.borrowAPR)}
                  </th>
                </tr>
              </thead>
              <tbody className="tw-mt-12">
                {assets.map(asset => (
                  <StatsRow asset={asset} key={asset} />
                ))}
              </tbody>
            </table>
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

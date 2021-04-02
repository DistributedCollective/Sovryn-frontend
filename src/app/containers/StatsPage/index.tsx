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
        <div className="container mt-5">
          <h1 className="text-center w-100">
            {t(translations.statsPage.titles.tradingVolume)}
          </h1>
          <div className="my-5 mx-3">
            <TradingVolume />
          </div>
          <h1 className="text-center w-100">
            {t(translations.statsPage.titles.tvl)}
          </h1>
          <div className="sovryn-border sovryn-table p-3 mt-5 mb-5">
            <TVL />
          </div>
          <h1 className="text-center w-100">
            {t(translations.statsPage.titles.lending)}
          </h1>
          <div className="sovryn-border sovryn-table p-3 mt-5 mb-5">
            <table className="w-100">
              <thead>
                <tr>
                  <th>{t(translations.statsPage.asset)}</th>
                  <th className="text-right">
                    {t(translations.statsPage.totalAssetSupplied)}
                  </th>
                  <th className="text-right">
                    {t(translations.statsPage.totalAssetBorrowed)}
                  </th>
                  <th className="text-right">
                    {t(translations.statsPage.totalAvailable)}
                  </th>
                  <th className="text-right">
                    {t(translations.statsPage.supplyAPR)}
                  </th>
                  <th className="text-right">
                    {t(translations.statsPage.borrowAPR)}
                  </th>
                </tr>
              </thead>
              <tbody className="mt-5">
                {assets.map(asset => (
                  <StatsRow asset={asset} key={asset} />
                ))}
              </tbody>
            </table>
          </div>
          <h1 className="text-center w-100">AMM Balances</h1>
          <div className="sovryn-border sovryn-table p-3 mt-5 mb-5">
            <AmmBalance />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

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

export function StatsPage() {
  const { t } = useTranslation();
  const assets = LendingPoolDictionary.assetList();
  return (
    <>
      <Header />
      <main>
        <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12">
          <div className="tw-text-center tw-w-full">Trading Volume</div>
          <div className="tw-ty-5 tw-mx-3">
            <TradingVolume />
          </div>
          <h1 className="tw-text-center tw-w-full">Total Value Locked</h1>
          <div className="sovryn-border sovryn-table tw-p-3 tw-mt-5 tw-mb-5">
            <TVL />
          </div>
          <div className="sovryn-border sovryn-table tw-p-4 tw-mt-12 tw-mb-12">
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
        </div>
      </main>
      <Footer />
    </>
  );
}

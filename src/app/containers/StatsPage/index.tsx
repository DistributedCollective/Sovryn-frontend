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

export function StatsPage() {
  const { t } = useTranslation();
  const assets = LendingPoolDictionary.assetList();
  return (
    <>
      <Header />
      <main>
        <div className="container mt-5">
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
        </div>
      </main>
      <Footer />
    </>
  );
}

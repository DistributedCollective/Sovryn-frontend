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
        <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12">
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

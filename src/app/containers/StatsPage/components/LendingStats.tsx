import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { StatsRow } from '../../../components/StatsRow';

export function LendingStats() {
  const { t } = useTranslation();
  const assets = LendingPoolDictionary.assetList();

  return (
    <table className="tw-w-full sovryn-table">
      <thead>
        <tr>
          <th className="tw-text-left tw-min-w-36">
            {t(translations.statsPage.asset)}
          </th>
          <th className="tw-text-right">
            {t(translations.statsPage.totalAssetSupplied)}
          </th>
          <th className="tw-text-right">
            {t(translations.statsPage.totalAssetBorrowed)}
          </th>
          <th className="tw-text-right tw-font-semibold">
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
  );
}

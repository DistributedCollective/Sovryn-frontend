import React from 'react';
import { useTranslation } from 'react-i18next';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { translations } from 'locales/i18n';
import { DataRow } from './DataRow';

export const LendingAssets: React.FC = () => {
  const { t } = useTranslation();
  const assets = LendingPoolDictionary.assetList();

  return (
    <div>
      <div className="tw-text-base tw-tracking-wider">
        {t(translations.statsPage.titles.lending)}
      </div>
      <div className="tw-mt-10 tw-overflow-auto">
        <table className="tw-text-left tw-w-full">
          <thead>
            <tr>
              <th>{t(translations.landingPage.lendingAssets.asset)}</th>
              <th>
                {t(translations.landingPage.lendingAssets.totalAvailable)}
              </th>
              <th>{t(translations.landingPage.lendingAssets.supplyAPR)}</th>
              <th>{t(translations.landingPage.lendingAssets.borrowAPR)}</th>
            </tr>
          </thead>
          <tbody className="tw-mt-8">
            {assets.map(asset => (
              <DataRow asset={asset} key={asset} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

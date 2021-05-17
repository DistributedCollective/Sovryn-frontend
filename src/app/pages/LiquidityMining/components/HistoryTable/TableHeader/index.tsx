import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';

export const TableHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <thead>
      <tr>
        <th className="tw-text-sm">
          {t(translations.liquidityMining.historyTable.tableHeaders.time)}
        </th>
        <th className="tw-text-sm">
          {t(translations.liquidityMining.historyTable.tableHeaders.pool)}
        </th>
        <th className="tw-text-sm">
          {t(translations.liquidityMining.historyTable.tableHeaders.action)}
        </th>
        <th className="tw-text-sm">
          {t(translations.liquidityMining.historyTable.tableHeaders.asset)}
        </th>
        <th className="tw-text-sm">
          {t(
            translations.liquidityMining.historyTable.tableHeaders
              .liquidityAmount,
          )}
        </th>
        <th className="tw-text-sm">
          {t(
            translations.liquidityMining.historyTable.tableHeaders
              .transactionHash,
          )}
        </th>
        <th className="tw-text-sm">
          {t(translations.liquidityMining.historyTable.tableHeaders.status)}
        </th>
      </tr>
    </thead>
  );
};

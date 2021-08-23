import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';

export const TableHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <thead>
      <tr>
        <th className="tw-text-sm">
          {t(translations.rewardPage.historyTable.tableHeaders.time)}
        </th>
        <th className="tw-text-sm">
          {t(translations.rewardPage.historyTable.tableHeaders.type)}
        </th>
        <th className="tw-text-sm">
          {t(translations.rewardPage.historyTable.tableHeaders.amount)}
        </th>
        <th className="tw-text-sm">
          {t(translations.rewardPage.historyTable.tableHeaders.transactionHash)}
        </th>
        <th className="tw-text-sm">
          {t(translations.rewardPage.historyTable.tableHeaders.status)}
        </th>
      </tr>
    </thead>
  );
};

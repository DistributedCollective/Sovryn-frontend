import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  VestedHistoryFieldsFragment,
  VestingContractType,
} from 'utils/graphql/rsk/generated';
import { VestedHistoryRow } from './VestedHistoryRow';

interface IVestedHistoryTableProps {
  events: VestedHistoryFieldsFragment[];
  type: VestingContractType;
}

export const VestedHistoryTable: React.FC<IVestedHistoryTableProps> = ({
  events,
  type,
}) => {
  const { t } = useTranslation();

  return (
    <tr>
      <td
        colSpan={10}
        className="tw-p-2 tw-border tw-border-gray tw-rounded-2xl"
      >
        <table className="tw-table tw-table-auto">
          <thead>
            <tr className="tw-bg-transparent">
              <th className="tw-text-left assets">
                {t(translations.vestedHistory.tableHeaders.time)}
              </th>
              <th className="tw-text-left">
                {t(translations.vestedHistory.tableHeaders.vestingSchedule)}
              </th>
              <th className="tw-text-left">
                {t(translations.vestedHistory.tableHeaders.amount)}
              </th>
              <th className="tw-text-left tw-hidden lg:tw-table-cell">
                {t(translations.vestedHistory.tableHeaders.hash)}
              </th>
              <th className="tw-text-left tw-hidden lg:tw-table-cell">
                {t(translations.vestedHistory.tableHeaders.status)}
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map(item => (
              <VestedHistoryRow key={item.id} event={item} type={type} />
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
};

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useGetVestedHistory } from 'app/hooks/staking/useGetVestedHistory';
import { VestedHistoryContracts } from './components/VestedHistoryContracts';

export function VestedHistory() {
  const { t } = useTranslation();
  const { data, loading } = useGetVestedHistory();

  const isEmpty = useMemo(() => !loading && !data?.vestingContracts.length, [
    loading,
    data,
  ]);

  return (
    <div className="sovryn-table tw-p-4 tw-mb-12">
      <table className="tw-w-full">
        <thead>
          <tr>
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
            <th></th>
          </tr>
        </thead>
        <tbody className="tw-mt-5 tw-font-body">
          {loading && (
            <tr key="loading">
              <td colSpan={99}>
                <SkeletonRow
                  loadingText={t(translations.topUpHistory.loading)}
                />
              </td>
            </tr>
          )}

          {isEmpty && (
            <tr key="empty">
              <td className="tw-text-center" colSpan={99}>
                {t(translations.stake.history.emptyHistory)}
              </td>
            </tr>
          )}

          {data &&
            data.vestingContracts.map(item => (
              <VestedHistoryContracts key={item.type} events={item} />
            ))}
        </tbody>
      </table>
    </div>
  );
}

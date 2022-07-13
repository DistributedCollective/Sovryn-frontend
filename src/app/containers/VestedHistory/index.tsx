import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useGetVestedHistory } from 'app/hooks/staking/useGetVestedHistory';
import { VestedHistoryRow } from './components/VestedHistoryRow';
import { VestedPagination } from './components/VestedPagination';
import { DEFAULT_PAGE_SIZE } from 'utils/classifiers';

export function VestedHistory() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, loading } = useGetVestedHistory(page, DEFAULT_PAGE_SIZE);

  const isEmpty = useMemo(() => !loading && !data?.stakeHistoryItems.length, [
    loading,
    data,
  ]);

  const isDisabled = useMemo(
    () => !data || (data && data.stakeHistoryItems.length < DEFAULT_PAGE_SIZE),
    [data],
  );

  const onPageChanged = useCallback(page => setPage(page), [setPage]);

  const isHiddenPagination = useMemo(
    () =>
      data &&
      data.stakeHistoryItems.length < DEFAULT_PAGE_SIZE &&
      page === 1 &&
      !loading,
    [data, page, loading],
  );

  return (
    <div className="sovryn-table tw-p-4 tw-mb-12">
      <table className="tw-w-full">
        <thead>
          <tr>
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
        <tbody className="tw-mt-5 tw-font-body">
          {loading && (
            <tr key={'loading'}>
              <td colSpan={99}>
                <SkeletonRow
                  loadingText={t(translations.topUpHistory.loading)}
                />
              </td>
            </tr>
          )}
          {isEmpty && (
            <tr key={'empty'}>
              <td className="tw-text-center" colSpan={99}>
                {t(translations.stake.history.emptyHistory)}
              </td>
            </tr>
          )}
          {data &&
            data.stakeHistoryItems.map(item => (
              <VestedHistoryRow key={item.id} event={item} />
            ))}
        </tbody>
      </table>

      {!isHiddenPagination && (
        <VestedPagination
          page={page}
          loading={loading}
          onChange={onPageChanged}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
}

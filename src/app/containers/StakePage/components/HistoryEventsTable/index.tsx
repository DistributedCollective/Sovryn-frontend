import React, { useMemo, useState, useCallback } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useGetStakeHistory } from '../../hooks/useGetStakeHistory';
import { StakePagination } from '../StakePagination';
import { HistoryEventRow } from './HistoryEventRow';

export const PAGE_SIZE = 5;

export const HistoryEventsTable: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, loading } = useGetStakeHistory(page, PAGE_SIZE);
  const isEmpty = useMemo(() => !loading && !data?.stakeHistoryItems.length, [
    loading,
    data,
  ]);

  const isDisabled = useMemo(() => {
    if (!data) {
      return true;
    }
    return data && data.stakeHistoryItems.length < PAGE_SIZE;
  }, [data]);

  const onPageChanged = useCallback(page => setPage(page), [setPage]);

  const isHiddenPagination = useMemo(
    () =>
      data &&
      data.stakeHistoryItems.length < PAGE_SIZE &&
      page === 1 &&
      !loading,
    [data, page, loading],
  );

  return (
    <>
      <table className="tw-table tw-table-auto">
        <thead>
          <tr>
            <th className="tw-text-left assets">
              {t(translations.stake.history.stakingDate)}
            </th>
            <th className="tw-text-left">
              {t(translations.stake.history.action)}
            </th>
            <th className="tw-text-left">
              {t(translations.stake.history.stakedAmount)}
            </th>
            <th className="tw-text-left tw-hidden lg:tw-table-cell">
              {t(translations.stake.history.hash)}
            </th>
            <th className="tw-text-left tw-hidden lg:tw-table-cell">
              {t(translations.stake.history.status)}
            </th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99} className="tw-text-center">
                {t(translations.openPositionTable.noData)}
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}

          {data &&
            data.stakeHistoryItems.map(value => (
              <HistoryEventRow event={value} key={value.id} />
            ))}
        </tbody>
      </table>
      {!isHiddenPagination && (
        <StakePagination
          page={page}
          loading={loading}
          onChange={onPageChanged}
          isDisabled={isDisabled}
        />
      )}
    </>
  );
};

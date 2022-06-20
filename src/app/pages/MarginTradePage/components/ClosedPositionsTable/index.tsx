import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { ClosedPositionRow } from './ClosedPositionRow';
import { useGetMarginLoans } from '../../hooks/useMargin_GetLoans';
import { LoanEvent, PAGE_SIZE } from '../../types';
import { MarginPagination } from '../MarginPagination';

export const ClosedPositionsTable: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, loading } = useGetMarginLoans(page, false, PAGE_SIZE);
  const isEmpty = useMemo(() => !loading && !data.loans.length, [
    loading,
    data,
  ]);

  const isDisabled = useMemo(() => data && data.loans.length < PAGE_SIZE, [
    data,
  ]);

  const onPageChanged = useCallback(page => setPage(page), [setPage]);

  const isHiddenPagination = useMemo(
    () => data && data.loans.length === 0 && page === 1 && !loading,
    [data, page, loading],
  );

  return (
    <>
      <table className="tw-table tw-table-auto">
        <thead>
          <tr>
            <th>{t(translations.tradingHistoryPage.table.direction)}</th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.positionSize)}
            </th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.leverage)}
            </th>
            <th className="tw-hidden md:tw-table-cell">
              {t(translations.tradingHistoryPage.table.openPrice)}
            </th>
            <th className="tw-hidden md:tw-table-cell">
              {t(translations.tradingHistoryPage.table.closePrice)}
            </th>
            <th>{t(translations.tradingHistoryPage.table.profit)}</th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.entryTxHash)}
            </th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.closeTxHash)}
            </th>
            <th>{t(translations.tradingHistoryPage.table.actions)}</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99} className="tw-text-center">
                {t(translations.tradingHistoryPage.noClosedTrades)}
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
            data.loans.map((loan: LoanEvent) => {
              return <ClosedPositionRow key={loan.id} event={loan} />;
            })}
        </tbody>
      </table>

      {!isHiddenPagination && (
        <MarginPagination
          page={page}
          loading={loading}
          onChange={onPageChanged}
          isDisabled={isDisabled}
        />
      )}
    </>
  );
};

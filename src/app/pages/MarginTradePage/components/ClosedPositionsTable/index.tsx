import React, { useCallback, useMemo, useState } from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { ClosedPositionRow } from './ClosedPositionRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Pagination } from 'app/components/Pagination';
import { useMargin_GetLoans } from '../../hooks/useMargin_GetLoans';

export const ClosedPositionsTable: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { events, loading, totalCount } = useMargin_GetLoans(page, false);
  const isEmpty = useMemo(() => !loading && !events, [loading, events]);
  const onPageChanged = useCallback(data => setPage(data.currentPage), []);

  return (
    <>
      <table className="tw-table">
        <thead>
          <tr>
            <th className="tw-w-full">
              {t(translations.tradingHistoryPage.table.direction)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.positionSize)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.leverage)}
            </th>
            <th className="tw-w-full tw-hidden md:tw-table-cell">
              {t(translations.tradingHistoryPage.table.openPrice)}
            </th>
            <th className="tw-w-full tw-hidden md:tw-table-cell">
              {t(translations.tradingHistoryPage.table.closePrice)}
            </th>
            <th className="tw-w-full">
              {t(translations.tradingHistoryPage.table.profit)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.entryTxHash)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.tradingHistoryPage.table.closeTxHash)}
            </th>
            <th className="tw-w-full">
              {t(translations.tradingHistoryPage.table.actions)}
            </th>
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

          {totalCount > 0 && (
            <>
              {events?.map(event => {
                return (
                  <ClosedPositionRow key={event.loanId} items={event.data} />
                );
              })}
            </>
          )}
        </tbody>
      </table>

      {totalCount > 0 && (
        <Pagination
          totalRecords={totalCount}
          pageLimit={6}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
};

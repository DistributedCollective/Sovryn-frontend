import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { PendingPositionRow } from './PendingPositionRow';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { HelpBadge } from 'app/components/HelpBadge/HelpBadge';
import { PositionRow } from './PositionRow';
import { useGetMarginLoansData } from '../../hooks/useMargin_GetLoans';
import { PAGE_SIZE } from '../../types';
import { MarginPagination } from '../MarginPagination';

export const OpenPositionsTable = () => {
  const { t } = useTranslation();
  const transactions = useSelector(selectTransactionArray);
  const [page, setPage] = useState(1);
  const { data, loading } = useGetMarginLoansData(page, true, PAGE_SIZE);
  const isEmpty = useMemo(
    () => !loading && !data?.loans.length && !transactions.length,
    [transactions, loading, data],
  );

  const isDisabled = useMemo(() => {
    if (!data) {
      return true;
    }
    return data && data.loans.length < PAGE_SIZE;
  }, [data]);

  const onGoingTransactions = useMemo(
    () =>
      transactions.length > 0 && (
        <>
          {transactions
            .filter(
              tx =>
                tx.type === TxType.TRADE &&
                [TxStatus.FAILED, TxStatus.PENDING].includes(tx.status),
            )
            .reverse()
            .map(item => (
              <PendingPositionRow key={item.transactionHash} item={item} />
            ))}
        </>
      ),
    [transactions],
  );

  const onPageChanged = useCallback(page => setPage(page), [setPage]);

  const isHiddenPagination = useMemo(
    () => data && data.loans.length < PAGE_SIZE && page === 1 && !loading,
    [data, page, loading],
  );

  return (
    <>
      <table className="tw-table tw-table-auto">
        <thead>
          <tr>
            <th>{t(translations.openPositionTable.direction)}</th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.positionSize)}
            </th>
            <th className="tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.entryPrice)}
            </th>
            <th className="tw-hidden md:tw-table-cell">
              {t(translations.openPositionTable.liquidationPrice)}
            </th>
            <th className="tw-hidden xl:tw-table-cell tw-whitespace-nowrap">
              <HelpBadge
                tooltip={
                  <Trans
                    i18nKey={
                      translations.openPositionTable.explainers.positionMargin
                    }
                    components={[<strong className="tw-font-bold" />]}
                  />
                }
              >
                {t(translations.openPositionTable.positionMargin)}
              </HelpBadge>
            </th>
            <th className="tw-hidden sm:tw-table-cell">
              {t(translations.openPositionTable.unrealizedPL)}
            </th>
            <th className="tw-hidden 2xl:tw-table-cell">
              {t(translations.openPositionTable.interestAPR)}
            </th>
            <th className="tw-hidden 2xl:tw-table-cell">
              {t(translations.openPositionTable.rolloverDate)}
            </th>
            <th className="tw-hidden 2xl:tw-table-cell">
              {t(translations.common.txHash)}
            </th>
            <th className="tw-text-right">
              {t(translations.openPositionTable.actions)}
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
          {onGoingTransactions}

          {loading && (
            <tr>
              <td colSpan={99}>
                <SkeletonRow />
              </td>
            </tr>
          )}

          {data &&
            data.loans.map(loan => {
              return <PositionRow key={loan.id} event={loan} />;
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

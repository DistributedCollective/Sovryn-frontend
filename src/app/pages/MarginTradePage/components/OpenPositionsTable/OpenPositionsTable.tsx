import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { PendingPositionRow } from './PendingPositionRow';
import { translations } from '../../../../../locales/i18n';
import { Pagination } from '../../../../components/Pagination';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { HelpBadge } from 'app/components/HelpBadge/HelpBadge';
import { useAccount } from 'app/hooks/useAccount';
import { useMargin_getActiveLoans } from './hooks/useMargin_getActiveLoans';
import { PositionRow } from './PositionRow';

const PER_PAGE = 6;

export const OpenPositionsTable = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const transactions = useSelector(selectTransactionArray);

  const account = useAccount();

  const { items: _items, loading } = useMargin_getActiveLoans(account);

  const items = useMemo(
    () => _items.slice(page * PER_PAGE - PER_PAGE, page * PER_PAGE),
    [_items, page],
  );

  const isEmpty = useMemo(
    () => !loading && !_items?.length && !transactions.length,
    [loading, _items, transactions],
  );

  const onPageChanged = useCallback(data => setPage(data.currentPage), []);
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

          {items.length > 0 && (
            <>
              {items?.map(event => (
                <PositionRow key={event.loanId} data={event} />
              ))}
            </>
          )}
        </tbody>
      </table>

      {_items.length > 0 && (
        <Pagination
          totalRecords={_items.length}
          pageLimit={6}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
};

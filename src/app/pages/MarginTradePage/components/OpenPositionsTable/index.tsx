import React, { useMemo, useState } from 'react';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { useAccount } from 'app/hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { OpenPositionRow } from './OpenPositionRow';
import { PendingPositionRow } from './PendingPositionRow';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Pagination } from '../../../../components/Pagination';
import { useSelector } from 'react-redux';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

interface IOpenPositionsTableProps {
  perPage: number;
}

export function OpenPositionsTable({ perPage }: IOpenPositionsTableProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const transactions = useSelector(selectTransactionArray);

  const { value, loading } = useGetActiveLoans(
    useAccount(),
    0,
    100,
    1,
    false,
    false,
  );

  const items = useMemo(
    () => value.slice(page * perPage - perPage, page * perPage),
    [perPage, page, value],
  );

  const isEmpty = !loading && !items.length && !transactions.length;

  const onPageChanged = data => {
    setPage(data.currentPage);
  };

  const onGoingTransactions = useMemo(() => {
    return (
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
      )
    );
  }, [transactions]);

  return (
    <>
      <table className="tw-table">
        <thead>
          <tr>
            <th className="tw-w-full">
              {t(translations.openPositionTable.direction)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.positionSize)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.entryPrice)}
            </th>
            <th className="tw-w-full tw-hidden md:tw-table-cell">
              {t(translations.openPositionTable.liquidationPrice)}
            </th>
            <th className="tw-w-full tw-hidden xl:tw-table-cell">
              {t(translations.openPositionTable.positionMargin)}
              <Popover
                content={
                  <div className="tw-px-12 tw-py-8 tw-font-normal">
                    <Trans
                      i18nKey={
                        translations.openPositionTable.explainers.positionMargin
                      }
                      components={[<strong className="tw-font-bold" />]}
                    />
                  </div>
                }
                className="tw-pl-2"
                popoverClassName={'tw-w-1/2 tw-transform tw-translate-x-full'}
              >
                <Icon className="tw-cursor-pointer" icon="info-sign" />
              </Popover>
            </th>
            <th className="tw-w-full tw-hidden sm:tw-table-cell">
              {t(translations.openPositionTable.unrealizedPL)}
              <Popover
                content={
                  <div className="tw-px-12 tw-py-8 tw-font-normal">
                    <Trans
                      i18nKey={
                        translations.openPositionTable.explainers.unrealizedPL
                      }
                      components={[<strong className="tw-font-bold" />]}
                    />
                  </div>
                }
                className="tw-pl-2"
                popoverClassName={'tw-w-1/2 tw-transform tw-translate-x-full'}
              >
                <Icon className="tw-cursor-pointer" icon="info-sign" />
              </Popover>
            </th>
            <th className="tw-w-full">
              {t(translations.openPositionTable.actions)}
            </th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={99}>{t(translations.openPositionTable.noData)}</td>
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
              {items.map(item => (
                <OpenPositionRow key={item.loanId} item={item} />
              ))}
            </>
          )}
        </tbody>
      </table>

      {value.length > 0 && (
        <Pagination
          totalRecords={value.length}
          pageLimit={perPage}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
}

OpenPositionsTable.defaultProps = {
  perPage: 5,
};

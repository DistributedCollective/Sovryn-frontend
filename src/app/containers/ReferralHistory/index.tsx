import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortBy, useTable } from 'react-table';
import { Tooltip } from '@blueprintjs/core';

import { translations } from 'locales/i18n';
import { weiToNumberFormat } from 'utils/display-text/format';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';

import iconSuccess from 'assets/images/icon-success.svg';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Pagination } from 'app/components/Pagination';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

export interface CalculatedEvent {
  blockNumber: number;
  eventDate: string;
  transactionHash: string;
  referrer: string;
  trader: string;
  token: Asset;
  tradingFeeTokenAmount: string;
  tokenBonusAmount: string;
  sovBonusAmount: string;
  sovBonusAmountPaid: string;
}

interface Props {
  items: CalculatedEvent[];
  referralList: string[];
}

export function ReferralHistory({ items, referralList }: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageLimit = 10;

  const data = React.useMemo(() => {
    return items
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(page * pageLimit - pageLimit, page * pageLimit)
      .map(item => {
        const trader = referralList.indexOf(item.trader);
        return {
          item: item,
          date: (
            <>
              <DisplayDate
                timestamp={(Date.parse(item.eventDate) / 1e3).toString()}
                timezoneOption="UTC"
                timezoneLabel="UTC"
              />
            </>
          ),
          from: (
            <>
              {trader > -1
                ? `${t(translations.referral.referralFrom)} #${trader + 1}`
                : t(translations.referral.referralUnknown)}
            </>
          ),
          sovAmount: (
            <>
              <Tooltip
                content={weiTo18(item.sovBonusAmountPaid)}
                className="tw-block"
              >
                <div>{weiToNumberFormat(item.sovBonusAmountPaid, 14)} SOV</div>
              </Tooltip>
            </>
          ),
          amount: (
            <>
              <Tooltip
                content={weiTo18(item.tradingFeeTokenAmount)}
                className="tw-block"
              >
                <div>
                  {weiToNumberFormat(item.tradingFeeTokenAmount, 14)}{' '}
                  <AssetSymbolRenderer asset={item.token} />
                </div>
              </Tooltip>
            </>
          ),
          txHash: (
            <LinkToExplorer
              txHash={item.transactionHash}
              className="tw-text-primary tw-truncate"
              startLength={5}
              endLength={5}
            />
          ),
          status: (
            <div className="d-flex tw-items-center">
              <>{t(translations.common.confirmed)}</>
              <div className="tw-ml-2">
                <img
                  src={iconSuccess}
                  title={t(translations.common.confirmed)}
                  alt={t(translations.common.confirmed)}
                />
              </div>
            </div>
          ),
        };
      })
      .filter(item => !!item);
  }, [items, page, referralList, t]);

  const columns = React.useMemo(
    () => [
      {
        Header: t(translations.referral.tableHeaders.date),
        accessor: 'date',
        className: 'tw-p-8',
      },
      {
        Header: t(translations.referral.tableHeaders.from),
        accessor: 'from',
      },
      {
        Header: t(translations.referral.tableHeaders.sovAmount),
        accessor: 'sovAmount',
      },
      {
        Header: t(translations.referral.tableHeaders.feesAmount),
        accessor: 'amount',
      },
      {
        Header: t(translations.referral.tableHeaders.hash),
        accessor: 'txHash',
      },
      {
        Header: t(translations.referral.tableHeaders.status),
        accessor: 'status',
      },
    ],
    [t],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  const onPageChanged = data => {
    setPage(data.currentPage);
  };

  return (
    <>
      <table {...getTableProps()} className="tw-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps({
                    className: column.headerClassName,
                    ...column.getSortByToggleProps(),
                  })}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {!rows?.length && (
            <tr key="empty">
              <td className="text-center" colSpan={columns.length}>
                {t(translations.referral.tableEmpty)}
              </td>
            </tr>
          )}
          {rows?.length > 0 &&
            rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>

      {items.length > 0 && (
        <Pagination
          totalRecords={items.length}
          pageLimit={pageLimit}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
}

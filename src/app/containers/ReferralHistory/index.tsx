import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortBy, useTable } from 'react-table';
import { Tooltip } from '@blueprintjs/core';

import { translations } from 'locales/i18n';
import { weiToNumberFormat } from 'utils/display-text/format';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Pagination } from 'app/components/Pagination';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

export interface CalculatedEvent {
  blockNumber: number;
  eventDate: string;
  transactionHash: string;
  referrer: string;
  //trader: string;
  token: Asset;
  tradingFeeTokenAmount: string;
  tokenBonusAmount: string;
  sovBonusAmount: string;
  sovBonusAmountPaid: string;
}

export function ReferralHistory(props: { items: CalculatedEvent[] }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageLimit = 10;

  const data = React.useMemo(() => {
    return props.items
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(page * pageLimit - pageLimit, page * pageLimit)
      .map(item => ({
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
        //from: (<>{item.trader}</>),
        from: <>Referral #xxx</>,
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
            <Tooltip
              content={weiTo18(item.sovBonusAmountPaid)}
              className="tw-block"
            >
              <div>{weiToNumberFormat(item.sovBonusAmountPaid, 14)} SOV</div>
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
        status: <div>Confirmed</div>,
      }))
      .filter(item => !!item);
  }, [props.items, page, pageLimit]);

  const columns = React.useMemo(
    () => [
      {
        Header: t(translations.referral.tableHeaders.date),
        accessor: 'date',
      },
      {
        Header: t(translations.referral.tableHeaders.from),
        accessor: 'from',
      },
      {
        Header: t(translations.referral.tableHeaders.amount),
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
                    className: column.className,
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

      {props.items.length > 0 && (
        <Pagination
          totalRecords={props.items.length}
          pageLimit={pageLimit}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </>
  );
}

import React, { useCallback, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Tooltip } from '@blueprintjs/core';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { TradeProfit } from 'app/components/TradeProfit';
import { PositionBlock } from '../OpenPositionsTable/PositionBlock';
import { LinkToExplorer } from '../../../../components/LinkToExplorer';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { Pagination } from '../../../../components/Pagination';
import { ICalculatedEvent } from './utils';

interface ICalculatedEventProps {
  items: ICalculatedEvent[];
}

export const HistoryTable: React.FC<ICalculatedEventProps> = ({ items }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageLimit = 5;

  const data = React.useMemo(() => {
    return items
      .slice(page * pageLimit - pageLimit, page * pageLimit)
      .map(item => {
        const pair = TradingPairDictionary.findPair(
          item.loanToken,
          item.collateralToken,
        );

        if (!pair) {
          return null;
        }
        const isLong = pair.longAsset === item.loanToken;

        return {
          item: item,
          icon: <PositionBlock position={item.position} name={pair.name} />,
          leverage: `${item.leverage}x`,
          positionSize: (
            <Tooltip content={weiTo18(item.positionSize)}>
              <span>
                {weiToNumberFormat(item.positionSize, 4)}{' '}
                {isLong ? item.loanToken : item.collateralToken}
              </span>
            </Tooltip>
          ),
          entryPrice: (
            <>
              {weiToNumberFormat(item.entryPrice, 4)}{' '}
              {isLong ? item.loanToken : item.collateralToken}
            </>
          ),
          closePrice: (
            <>
              {weiToNumberFormat(item.closePrice, 4)}{' '}
              {isLong ? item.loanToken : item.collateralToken}
            </>
          ),
          profit: (
            <TradeProfit
              positionSize={item.positionSize}
              pair={pair}
              loanId={item.loanId}
              loanToken={item.loanToken}
              closePrice={item.closePrice}
              entryPrice={item.entryPrice}
              position={item.position}
              asset={item.collateralToken}
            />
          ),
          entryTxHash: (
            <LinkToExplorer
              txHash={item.entryTxHash}
              className="tw-text-primary tw-truncate"
              startLength={5}
              endLength={5}
            />
          ),
          closeTxHash: (
            <LinkToExplorer
              txHash={item.closeTxHash}
              className="tw-text-primary tw-truncate"
              startLength={5}
              endLength={5}
            />
          ),
        };
      });
  }, [items, page, pageLimit]);

  const columns = React.useMemo(
    () => [
      {
        Header: t(translations.tradingHistoryPage.table.direction),
        accessor: 'icon',
      },
      {
        Header: t(translations.tradingHistoryPage.table.positionSize),
        accessor: 'positionSize',
      },
      {
        Header: t(translations.tradingHistoryPage.table.leverage),
        accessor: 'leverage',
        className: 'tw-hidden xl:tw-table-cell',
      },
      {
        Header: t(translations.tradingHistoryPage.table.openPrice),
        accessor: 'entryPrice',
        className: 'tw-hidden xl:tw-table-cell',
      },
      {
        Header: t(translations.tradingHistoryPage.table.closePrice),
        accessor: 'closePrice',
        className: 'tw-hidden xl:tw-table-cell',
      },
      {
        Header: t(translations.tradingHistoryPage.table.profit),
        accessor: 'profit',
      },
      {
        Header: t(translations.tradingHistoryPage.table.entryTxHash),
        accessor: 'entryTxHash',
      },
      {
        Header: t(translations.tradingHistoryPage.table.closeTxHash),
        accessor: 'closeTxHash',
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

  const onPageChanged = useCallback(data => {
    setPage(data.currentPage);
  }, []);

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
          {rows.map(row => {
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
};

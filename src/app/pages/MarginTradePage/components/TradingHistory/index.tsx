import React, { useCallback, useEffect, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { Asset } from '../../../../../types';
import { TradingPosition } from 'types/trading-position';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { toWei, weiTo18 } from 'utils/blockchain/math-helpers';
import { useAccount } from '../../../../hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { TradeProfit } from 'app/components/TradeProfit';
import { PositionBlock } from '../OpenPositionsTable/PositionBlock';
import { LinkToExplorer } from '../../../../components/LinkToExplorer';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { Pagination } from '../../../../components/Pagination';
import { backendUrl, currentChainId } from 'utils/classifiers';
import axios from 'axios';

type EventType = 'buy' | 'sell';

interface CustomEvent {
  loanId: string;
  loanToken: Asset;
  collateralToken: Asset;
  position: TradingPosition;
  type: EventType;
  leverage: string;
  positionSize: string;
  price: string;
  txHash: string;
  isOpen: boolean;
  time: number;
  event: string;
  collateralToLoanRate: string;
}

interface EventData {
  data: Array<CustomEvent>;
  isOpen: boolean;
  loanId: string;
}

export interface CalculatedEvent {
  loanId: string;
  position: TradingPosition;
  loanToken: Asset;
  collateralToken: Asset;
  leverage: string;
  positionSize: string;
  entryPrice: string;
  closePrice: string;
  profit: string;
  entryTxHash: string;
  closeTxHash: string;
  time: number;
}

function normalizeEvent(
  event: CustomEvent,
  isOpen: boolean,
): CustomEvent | undefined {
  const loanToken = AssetsDictionary.getByTokenContractAddress(event.loanToken)
    .asset;
  const collateralToken = AssetsDictionary.getByTokenContractAddress(
    event.collateralToken,
  ).asset;
  const pair = TradingPairDictionary.findPair(loanToken, collateralToken);

  if (pair === undefined) {
    return undefined;
  }

  const position =
    pair.longAsset === loanToken ? TradingPosition.LONG : TradingPosition.SHORT;

  const loanId = event.loanId;

  switch (event.event) {
    default:
    case 'Trade':
      return {
        loanId,
        loanToken,
        collateralToken,
        position,
        type: 'buy',
        leverage: event.leverage + 1,
        positionSize: event.positionSize,
        price: event.collateralToLoanRate,
        txHash: event.txHash,
        isOpen: isOpen,
        time: event.time,
        event: event.event,
        collateralToLoanRate: event.collateralToLoanRate,
      };
    case 'CloseWithSwap':
      return {
        loanId,
        loanToken,
        collateralToken,
        position,
        type: 'sell',
        leverage: event.leverage + 1,
        positionSize: event.positionSize,
        price: event.collateralToLoanRate,
        txHash: event.txHash,
        isOpen: isOpen,
        time: event.time,
        event: event.event,
        collateralToLoanRate: event.collateralToLoanRate,
      };
  }
}

function calculateProfits(events: CustomEvent[]): CalculatedEvent | null {
  const opens = events.filter(item => item.type === 'buy');
  const closes = events.filter(item => item.type === 'sell');
  const positionSize = opens
    .reduce(
      (previous, current) => previous.add(current.positionSize),
      bignumber('0'),
    )
    .toString();

  const pair = TradingPairDictionary.findPair(
    opens[0].loanToken,
    opens[0].collateralToken,
  );

  const prettyPrice = (amount: string) => {
    return events[0].loanToken === pair.shortAsset
      ? amount
      : toWei(
          bignumber(1)
            .div(amount)
            .mul(10 ** 18),
        );
  };

  const entryPrice = prettyPrice(opens[0].collateralToLoanRate);
  const closePrice = prettyPrice(
    closes[closes.length - 1].collateralToLoanRate,
  );

  let change = bignumber(bignumber(closePrice).minus(entryPrice))
    .div(entryPrice)
    .toNumber();
  if (events[0].position === TradingPosition.SHORT) {
    change = bignumber(bignumber(entryPrice).minus(closePrice))
      .div(entryPrice)
      .toNumber();
  }

  const profit = bignumber(change).mul(bignumber(positionSize)).toFixed(0);

  return {
    loanId: events[0].loanId,
    position: events[0].position,
    collateralToken: events[0].collateralToken,
    loanToken: events[0].loanToken,
    leverage: events[0].leverage,
    positionSize,
    entryPrice,
    closePrice,
    profit: profit,
    entryTxHash: opens[0].txHash || '',
    closeTxHash: closes[closes.length - 1].txHash || '',
    time: events[0].time,
  };
}

export function TradingHistory() {
  const { t } = useTranslation();
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [eventsHistory, setEventsHistory] = useState<EventData[]>([]);

  const getHistory = useCallback(() => {
    if (currentChainId) {
      setLoading(true);
      axios
        .get(`${backendUrl[currentChainId]}/events/trade/${account}`)
        .then(({ data }) => {
          setEventsHistory(data.events);
          setLoading(false);
        });
    }
  }, [account]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const [events, setEvents] = useState<CalculatedEvent[]>([]);

  const mergeEvents = useCallback(() => {
    const items: { [key: string]: CustomEvent[] } = {};
    if (!loading) {
      eventsHistory.forEach(item => {
        const loanId = item.loanId.toLowerCase();
        if (!items.hasOwnProperty(loanId)) {
          items[loanId] = [];
        }
        item.data.forEach((element: CustomEvent) => {
          const event = normalizeEvent(element, false);
          if (event !== undefined) {
            items[loanId].push(event);
          }
        });
      });
    }

    const entries = Object.entries(items);
    const closeEntries: CalculatedEvent[] = [];
    entries.forEach(([, events]) => {
      // exclude entries that does not have sell events
      if (events.filter(item => item.type === 'sell').length > 0) {
        const calculation = calculateProfits(events);
        if (calculation) {
          closeEntries.push(calculation);
        }
      }
    });
    const sortedEntries = closeEntries.sort(function (a, b) {
      return b.time - a.time;
    });
    setEvents(sortedEntries);
  }, [eventsHistory, loading]);

  useEffect(() => {
    if (account && eventsHistory) {
      mergeEvents();
    }
  }, [account, eventsHistory, mergeEvents]);

  if (loading && !events.length) {
    return <SkeletonRow />;
  }

  if (!loading && !events.length) {
    return (
      <div className="tw-p-4">
        {t(translations.tradingHistoryPage.noClosedTrades)}
      </div>
    );
  }

  return (
    <>
      <HistoryTable items={events} />
    </>
  );
}

function HistoryTable(props: { items: CalculatedEvent[] }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageLimit = 5;

  const data = React.useMemo(() => {
    return props.items
      .slice(page * pageLimit - pageLimit, page * pageLimit)
      .map(item => {
        const pair = TradingPairDictionary.findPair(
          item.loanToken,
          item.collateralToken,
        );

        if (pair === undefined) return null;

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
      })
      .filter(item => !!item);
  }, [props.items, page, pageLimit]);

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

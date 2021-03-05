import React, { useCallback, useEffect, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EventData } from 'web3-eth-contract';
import { translations } from 'locales/i18n';
import { useAccount } from '../../hooks/useAccount';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { Asset } from '../../../types/asset';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { TradingPosition } from '../../../types/trading-position';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
} from '@fortawesome/free-solid-svg-icons';
import {
  toWei,
  weiTo18,
  weiTo2,
  weiTo4,
  weiToFixed,
} from '../../../utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { TradeProfit } from '../../components/TradeProfit';
import { useGetContractPastEvents } from '../../hooks/useGetContractPastEvents';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';

type EventType = 'buy' | 'sell';

interface CustomEvent {
  blockNumber: number;
  loanId: string;
  loanToken: Asset;
  collateralToken: Asset;
  position: TradingPosition;
  type: EventType;
  leverage: string;
  positionSize: string;
  price: string;
}

export interface CalculatedEvent {
  blockNumber: number;
  loanId: string;
  position: TradingPosition;
  loanToken: Asset;
  collateralToken: Asset;
  leverage: string;
  positionSize: string;
  entryPrice: string;
  closePrice: string;
  profit: string;
}

function normalizeEvent(event: EventData): CustomEvent {
  const loanToken = AssetsDictionary.getByTokenContractAddress(
    event.returnValues.loanToken,
  ).asset;
  const collateralToken = AssetsDictionary.getByTokenContractAddress(
    event.returnValues.collateralToken,
  ).asset;
  const position = TradingPairDictionary.longPositionTokens.includes(loanToken)
    ? TradingPosition.LONG
    : TradingPosition.SHORT;
  const loanId = event.returnValues.loanId;
  switch (event.event) {
    default:
    case 'Trade':
      return {
        blockNumber: event.blockNumber,
        loanId,
        loanToken,
        collateralToken,
        position,
        type: 'buy',
        leverage: event.returnValues.entryLeverage,
        positionSize: event.returnValues.positionSize,
        price: event.returnValues.entryPrice,
      };
    case 'CloseWithSwap':
      return {
        blockNumber: event.blockNumber,
        loanId,
        loanToken,
        collateralToken,
        position,
        type: 'sell',
        leverage: event.returnValues.currentLeverage,
        positionSize: event.returnValues.positionCloseSize,
        price: event.returnValues.exitPrice,
      };
  }
}

function calculateProfits(events: CustomEvent[]): CalculatedEvent | null {
  events = events.reverse();
  const opens = events.filter(item => item.type === 'buy');
  const closes = events.filter(item => item.type === 'sell');

  if (!opens.length) {
    return null;
  }

  const positionSize = opens
    .reduce(
      (previous, current) => previous.add(current.positionSize),
      bignumber('0'),
    )
    .toString();
  const openSize = closes.reduce(
    (previous, current) => previous.minus(current.positionSize),
    bignumber(positionSize),
  );

  if (openSize.greaterThan(0)) {
    // Position is still open, ignore calculations.
    return null;
  }

  const leverage = bignumber(opens[0].leverage)
    .add(10 ** 18)
    .toString();

  const prettyPrice = amount => {
    return events[0].loanToken === Asset.BTC
      ? amount
      : toWei(
          bignumber(1)
            .div(amount)
            .mul(10 ** 18),
        );
  };

  const entryPrice = prettyPrice(opens[0].price);
  const closePrice = prettyPrice(closes[closes.length - 1].price);

  // Profit for long
  let unitProfit = bignumber(closePrice).minus(entryPrice).toString();
  if (events[0].position === TradingPosition.SHORT) {
    unitProfit = bignumber(entryPrice).minus(closePrice).toString();
  }

  let profit = toWei(
    bignumber(unitProfit)
      .mul(positionSize)
      .div(10 ** 36),
  );

  if (
    TradingPairDictionary.longPositionTokens.includes(events[0].collateralToken)
  ) {
    profit = toWei(bignumber(profit).div(closePrice));
  }

  return {
    loanId: events[0].loanId,
    blockNumber: events[0].blockNumber,
    position: events[0].position,
    collateralToken: events[0].collateralToken,
    loanToken: events[0].loanToken,
    leverage,
    positionSize,
    entryPrice,
    closePrice,
    profit: profit,
  };
}

export function TradingHistory() {
  const { t } = useTranslation();
  const account = useAccount();

  const tradeStates = useGetContractPastEvents('sovrynProtocol', 'Trade');
  const closeStates = useGetContractPastEvents(
    'sovrynProtocol',
    'CloseWithSwap',
  );

  const loading = tradeStates.loading || closeStates.loading;

  const [events, setEvents] = useState<CalculatedEvent[]>([]);

  const mergeEvents = useCallback(
    (closeEvents: EventData[] = [], tradeEvents: EventData[] = []) => {
      const mergedEvents = [...closeEvents, ...tradeEvents].sort(
        (a, b) => b.blockNumber - a.blockNumber,
      );

      const items: { [key: string]: CustomEvent[] } = {};
      mergedEvents.forEach(item => {
        const loanId = item.returnValues.loanId.toLowerCase();
        if (!items.hasOwnProperty(loanId)) {
          items[loanId] = [];
        }
        items[loanId].push(normalizeEvent(item));
      });

      const entries = Object.entries(items);

      const closeEntries: CalculatedEvent[] = [];
      entries.forEach(([, /*loanId*/ events]) => {
        // exclude entries that does not have sell events
        if (events.filter(item => item.type === 'sell').length > 0) {
          const calculation = calculateProfits(events);
          if (calculation) {
            closeEntries.push(calculation);
          }
        }
      });

      setEvents(closeEntries);
    },
    [],
  );

  useEffect(() => {
    if (account) {
      mergeEvents(closeStates.events, tradeStates.events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(tradeStates.events),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(closeStates.events),
  ]);

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
  const prettyPrice = useCallback(
    amount => `$ ${parseFloat(weiTo2(amount)).toLocaleString('en')}`,
    [],
  );

  const data = React.useMemo(() => {
    return props.items.map(item => {
      return {
        item: item,
        icon: (
          <>
            {item.position === TradingPosition.LONG ? (
              <FontAwesomeIcon
                icon={faArrowAltCircleUp}
                className="text-customTeal tw-ml-2"
                style={{ fontSize: '20px' }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faArrowAltCircleDown}
                className="text-Gold tw-ml-2"
                style={{ fontSize: '20px' }}
              />
            )}
          </>
        ),
        leverage: `${weiToFixed(item.leverage, 1)}x`,
        positionSize: (
          <Tooltip content={weiTo18(item.positionSize)}>
            <span>
              {weiTo4(item.positionSize)} {item.collateralToken}
            </span>
          </Tooltip>
        ),
        entryPrice: prettyPrice(item.entryPrice),
        closePrice: prettyPrice(item.closePrice),
        profit: (
          <TradeProfit
            profit={item.profit}
            closePrice={item.closePrice}
            entryPrice={item.entryPrice}
            position={item.position}
          />
        ),
      };
    });
  }, [props.items, prettyPrice]);

  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'icon',
      },
      {
        Header: t(translations.tradingHistoryPage.table.positionSize),
        accessor: 'positionSize',
      },
      {
        Header: t(translations.tradingHistoryPage.table.leverage),
        accessor: 'leverage',
      },
      {
        Header: t(translations.tradingHistoryPage.table.openPrice),
        accessor: 'entryPrice',
      },
      {
        Header: t(translations.tradingHistoryPage.table.closePrice),
        accessor: 'closePrice',
      },
      {
        Header: t(translations.tradingHistoryPage.table.profit),
        accessor: 'profit',
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

  return (
    <div className="bg-primary tw-p-6 sovryn-border">
      <table {...getTableProps()} className="sovryn-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                  <td className="tw-text-left" {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { useMemo, useEffect, useContext } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { TradingPosition } from 'types/trading-position';
import {
  PerpetualTradeType,
  PerpetualTradeEvent,
  PerpetualLiquidationEvent,
} from '../types';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  Event,
  useGetTraderEvents,
  OrderDirection,
  EventQuery,
} from './graphql/useGetTraderEvents';
import { ABK64x64ToWei } from '../utils/contractUtils';
import { BigNumber } from 'ethers';
import { RecentTradesContext } from '../contexts/RecentTradesContext';
import debounce from 'lodash.debounce';

// TODO: Finalize this enum once we know what possible order states we can have
enum OrderState {
  Filled = 'Filled',
  Open = 'Open',
  Failed = 'Failed',
}

export type OrderHistoryEntry = {
  id: string;
  pairType: PerpetualPairType;
  datetime: string;
  position?: TradingPosition;
  tradeType: PerpetualTradeType;
  orderState: OrderState;
  orderSize: string;
  limitPrice?: string;
  execSize: string;
  execPrice?: string;
  orderId?: string;
};

type OrderHistoryHookResult = {
  loading: boolean;
  data?: OrderHistoryEntry[];
  totalCount: number;
};

export const usePerpetual_OrderHistory = (
  pairType: PerpetualPairType,
  page: number,
  perPage: number,
): OrderHistoryHookResult => {
  const account = useAccount();

  const { latestTradeByUser } = useContext(RecentTradesContext);

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  // page and per page is not used, as Trade and Liquidate Events are combined into one Paginated Table
  // According to Remy a backend solution is not possible, vasili decided to throw out queried pagination.
  const eventQuery = useMemo(
    (): EventQuery[] => [
      {
        event: Event.TRADE,
        orderBy: 'blockTimestamp',
        orderDirection: OrderDirection.desc,
        page: 1,
        perPage: 1000,
        whereCondition: `perpetual: ${JSON.stringify(pair.id)}`,
      },
      {
        event: Event.LIQUIDATE,
        orderBy: 'blockTimestamp',
        orderDirection: OrderDirection.desc,
        page: 1,
        perPage: 1000,
        whereCondition: `perpetual: ${JSON.stringify(pair.id)}`,
      },
    ],
    [pair.id],
  );

  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    refetch,
    loading,
  } = useGetTraderEvents(account.toLowerCase(), eventQuery);

  const data: OrderHistoryEntry[] = useMemo(() => {
    const currentTradeEvents: PerpetualTradeEvent[] =
      tradeEvents?.trader?.trades || previousTradeEvents?.trader?.trades || [];
    const currentTradeEventsLength = currentTradeEvents.length;
    const currentLiquidationEvents: PerpetualLiquidationEvent[] =
      tradeEvents?.trader?.liquidates ||
      previousTradeEvents?.trader?.liquidates ||
      [];
    let entries: OrderHistoryEntry[] = [];

    if (currentTradeEventsLength > 0) {
      entries = currentTradeEvents.map(item => {
        const tradeAmount = BigNumber.from(item.tradeAmountBC);
        const tradeAmountWei = ABK64x64ToWei(tradeAmount);
        return {
          id: item.id,
          pairType: pairType,
          datetime: item.blockTimestamp,
          position: tradeAmount.isNegative()
            ? TradingPosition.SHORT
            : TradingPosition.LONG,
          tradeType: PerpetualTradeType.MARKET,
          orderState: OrderState.Filled,
          orderSize: tradeAmountWei,
          limitPrice: ABK64x64ToWei(BigNumber.from(item.limitPrice)),
          execSize: tradeAmountWei,
          execPrice: ABK64x64ToWei(BigNumber.from(item.price)),
          orderId: item.transaction.id,
        };
      });
      const oldestTradeTimestamp = Number(entries[entries.length - 1].datetime);
      entries.push(
        ...currentLiquidationEvents
          .filter(
            liquidation =>
              liquidation &&
              Number(liquidation.blockTimestamp) > oldestTradeTimestamp,
          )
          .map(item => {
            const tradeAmountWei = ABK64x64ToWei(
              BigNumber.from(item.amountLiquidatedBC),
            );
            return {
              id: item.id,
              pairType: pairType,
              datetime: item.blockTimestamp,
              position: undefined,
              tradeType: PerpetualTradeType.LIQUIDATION,
              orderState: OrderState.Filled,
              orderSize: tradeAmountWei,
              limitPrice: undefined,
              execSize: tradeAmountWei,
              execPrice: ABK64x64ToWei(BigNumber.from(item.liquidationPrice)),
              orderId: item.transaction.id,
            };
          }),
      );
      entries.sort((a, b) => Number(b.datetime) - Number(a.datetime));
    }
    return entries;
  }, [
    pairType,
    previousTradeEvents?.trader?.trades,
    tradeEvents?.trader?.trades,
    previousTradeEvents?.trader?.liquidates,
    tradeEvents?.trader?.liquidates,
  ]);

  const paginatedData = useMemo(
    () => data && data.slice((page - 1) * perPage, page * perPage),
    [data, page, perPage],
  );

  const refetchDebounced = useMemo(
    () =>
      debounce(refetch, 1000, {
        leading: false,
        trailing: true,
        maxWait: 1000,
      }),
    [refetch],
  );

  useEffect(() => {
    if (latestTradeByUser) {
      refetchDebounced();
    }
  }, [latestTradeByUser, refetchDebounced]);

  return {
    data: paginatedData,
    loading,
    totalCount: data.length,
  };
};

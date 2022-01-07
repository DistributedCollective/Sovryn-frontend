import { useMemo, useEffect, useContext } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { TradingPosition } from 'types/trading-position';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTradeType } from '../types';
import {
  Event,
  useGetTraderEvents,
  OrderDirection,
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
  position: TradingPosition;
  tradeType: PerpetualTradeType;
  orderState: OrderState;
  orderSize: string;
  limitPrice: string;
  execSize: string;
  execPrice: string;
  orderId: string;
};

type OrderHistoryHookResult = {
  loading: boolean;
  data?: OrderHistoryEntry[];
  totalCount: number;
};

export const usePerpetual_OrderHistory = (
  pairType: PerpetualPairType.BTCUSD,
  page: number,
  perPage: number,
): OrderHistoryHookResult => {
  const account = useAccount();

  const { latestTradeByUser } = useContext(RecentTradesContext);

  const eventQuery = useMemo(
    () => [
      {
        event: Event.TRADE,
        orderBy: 'blockTimestamp',
        orderDirection: OrderDirection.desc,
        page,
        perPage,
      },
    ],
    [page, perPage],
  );

  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    refetch,
    loading,
  } = useGetTraderEvents(account.toLowerCase(), eventQuery);

  const data: OrderHistoryEntry[] = useMemo(() => {
    const currentTradeEvents =
      tradeEvents?.trader?.trades || previousTradeEvents?.trader?.trades;
    const currentTradeEventsLength = currentTradeEvents?.length;
    let entries: OrderHistoryEntry[] = [];

    if (currentTradeEventsLength > 0) {
      entries = currentTradeEvents.map(item => {
        return {
          id: item.id,
          pairType: pairType,
          datetime: item.blockTimestamp,
          position:
            item.tradeAmountBC > 0
              ? TradingPosition.LONG
              : TradingPosition.SHORT,
          tradeType: PerpetualTradeType.MARKET,
          orderState: OrderState.Filled,
          orderSize: ABK64x64ToWei(BigNumber.from(item.tradeAmountBC)),
          limitPrice: ABK64x64ToWei(BigNumber.from(item.limitPrice)),
          execSize: ABK64x64ToWei(BigNumber.from(item.tradeAmountBC)),
          execPrice: ABK64x64ToWei(BigNumber.from(item.price)),
          orderId: item.transaction.id,
        };
      });
    }
    return entries;
  }, [
    pairType,
    previousTradeEvents?.trader?.trades,
    tradeEvents?.trader?.trades,
  ]);

  const totalCount = useMemo(
    () =>
      tradeEvents?.trader?.tradesTotalCount ||
      previousTradeEvents?.trader?.tradesTotalCount,
    [
      previousTradeEvents?.trader?.tradesTotalCount,
      tradeEvents?.trader?.tradesTotalCount,
    ],
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
    data,
    loading,
    totalCount,
  };
};

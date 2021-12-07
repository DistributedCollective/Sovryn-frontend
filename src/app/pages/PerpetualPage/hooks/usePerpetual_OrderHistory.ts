import { useMemo } from 'react';
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
};

export const usePerpetual_OrderHistory = (
  pairType: PerpetualPairType.BTCUSD,
  page: number,
  perPage: number,
): OrderHistoryHookResult => {
  const account = useAccount();

  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    loading,
  } = useGetTraderEvents(
    [Event.TRADE],
    account.toLowerCase(),
    'blockTimestamp',
    OrderDirection.desc,
  );

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

  return { data, loading };
};

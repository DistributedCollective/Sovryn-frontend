import { TradingPosition } from 'types/trading-position';
import { toWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTradeType } from '../types';

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
): OrderHistoryHookResult => {
  // TODO: implement OrderHistory hook
  return {
    data: [
      {
        id: '1',
        pairType: pairType,
        datetime: '1637367029',
        position: TradingPosition.LONG,
        tradeType: PerpetualTradeType.MARKET,
        orderState: OrderState.Filled,
        orderSize: toWei(0.004),
        limitPrice: toWei(44889.95),
        execSize: toWei(0.004),
        execPrice: toWei(44899),
        orderId:
          '0x1385f31fbac92f8dcbc0f0b4902a55837207b672b4900518ea56c25d7f54c4a2',
      },
    ],
    loading: false,
  };
};

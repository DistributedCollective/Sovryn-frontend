import { TradingPosition } from 'types/trading-position';
import { toWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';

export type ClosedPositionEntry = {
  id: string;
  pairType: PerpetualPairType;
  datetime: string;
  positionSize: string;
  realizedPnl: { baseValue: number; quoteValue: number };
  position: TradingPosition;
};

type ClosedPositionHookResult = {
  loading: boolean;
  data?: ClosedPositionEntry[];
};

export const usePerpetual_ClosedPositions = (
  pairType: PerpetualPairType.BTCUSD,
): ClosedPositionHookResult => {
  // TODO: implement ClosedPositions hook
  return {
    data: [
      {
        id: '1',
        pairType: pairType,
        datetime: '1637367029',
        positionSize: toWei(0.02),
        realizedPnl: { baseValue: 0.002, quoteValue: 1000 },
        position: TradingPosition.LONG,
      },
      {
        id: '2',
        pairType: pairType,
        datetime: '1631794829',
        positionSize: toWei(0.4),
        realizedPnl: { baseValue: 0.102, quoteValue: 6000 },
        position: TradingPosition.SHORT,
      },
    ],
    loading: false,
  };
};

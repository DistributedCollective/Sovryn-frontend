import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpatual-pair-dictionary';

export enum PerpetualTradeType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum PerpetualPageModals {
  NONE = 'NONE',
  TRADE_SETTINGS = 'TRADE_SETTINGS',
}

export interface PerpetualPageState {
  pairType: PerpetualPairType;
  tradeType: PerpetualTradeType;
  collateral: Asset;
  amount: string;
  leverage: number;
  position: TradingPosition;
  modal: PerpetualPageModals;
}

export type ContainerState = PerpetualPageState;

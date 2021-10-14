import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';

export enum PerpetualTradeType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum PerpetualPageModals {
  NONE = 'NONE',
  ACCOUNT_BALANCE = 'ACCOUNT_BALANCE',
  ACCOUNT_HISTORY = 'ACCOUNT_HISTORY',
  FASTBTC_DEPOSIT = 'FASTBTC_DEPOSIT',
  FASTBTC_WITHDRAW = 'FASTBTC_WITHDRAW',
  FASTBTC_TRANSFER = 'FASTBTC_TRANSFER',
  TRADE_SETTINGS = 'TRADE_SETTINGS',
}

export interface PerpetualPageState {
  pairType: PerpetualPairType;
  tradeType: PerpetualTradeType;
  collateral: Asset;
  amount: string;
  limit: string;
  leverage: number;
  position: TradingPosition;
  modal: PerpetualPageModals;
}

export type ContainerState = PerpetualPageState;

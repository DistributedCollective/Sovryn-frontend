import { Asset } from '../../../types';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';

export const PERPETUAL_SLIPPAGE_DEFAULT = 0.5;

export enum PerpetualTradeType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum PerpetualPageModals {
  NONE = 'NONE',
  ACCOUNT_BALANCE = 'ACCOUNT_BALANCE',
  FASTBTC_DEPOSIT = 'FASTBTC_DEPOSIT',
  FASTBTC_WITHDRAW = 'FASTBTC_WITHDRAW',
  FASTBTC_TRANSFER = 'FASTBTC_TRANSFER',
  TRADE_REVIEW = 'TRADE_REVIEW',
  EDIT_POSITION_SIZE = 'EDIT_POSITION_SIZE',
  EDIT_LEVERAGE = 'EDIT_LEVERAGE',
  EDIT_MARGIN = 'EDIT_MARGIN',
  CLOSE_POSITION = 'CLOSE_POSITION',
}

export type PerpetualTradeEvent = {
  id: string;
  perpetualId: string;
  trader: string;
  orderFlags: string;
  tradeAmount: string;
  price: string;
  blockTimestamp: string;
  transaction: { id: string };
};

export type PerpetualTrade = {
  id?: string;
  pairType: PerpetualPairType;
  collateral: Asset;
  tradeType: PerpetualTradeType;
  position: TradingPosition;
  /** wei string */
  amount: string;
  /** wei string */
  limit?: string;
  leverage: number;
  slippage: number;
  entryPrice: number;
};

export const isPerpetualTrade = (x: any): x is PerpetualTrade =>
  x &&
  typeof x === 'object' &&
  typeof x.pairType === 'string' &&
  typeof x.collateral === 'string' &&
  typeof x.tradeType === 'string' &&
  typeof x.position === 'string' &&
  typeof x.amount === 'string' &&
  typeof x.leverage === 'number' &&
  typeof x.slippage === 'number' &&
  typeof x.entryPrice === 'number' &&
  (x.limit === undefined || typeof x.limit === 'string');

export type PerpetualPageState = {
  pairType: PerpetualPairType;
  collateral: Asset;
  modal: PerpetualPageModals;
  modalOptions: any;
};

export type ContainerState = PerpetualPageState;

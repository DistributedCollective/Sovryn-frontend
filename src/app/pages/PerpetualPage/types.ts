import { Asset, Nullable } from '../../../types';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';
import { Transaction } from 'ethers';

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
  /** wei string */
  margin?: string;
  leverage: number;
  slippage: number;
  entryPrice: number;
};

export type PerpetualTradeReview = {
  origin: PerpetualPageModals;
  trade: PerpetualTrade;
};

export type PendingTransactions = Nullable<Transaction>[];

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
  (x.limit === undefined || typeof x.limit === 'string') &&
  (x.margin === undefined || typeof x.margin === 'string');

export const isPerpetualTradeReview = (x: any): x is PerpetualTradeReview =>
  x &&
  typeof x === 'object' &&
  PerpetualPageModals[x.origin] !== undefined &&
  isPerpetualTrade(x.trade);

export type PerpetualPageState = {
  pairType: PerpetualPairType;
  collateral: Asset;
  modal: PerpetualPageModals;
  modalOptions?: PerpetualTrade | PerpetualTradeReview | PendingTransactions;
};

export type ContainerState = PerpetualPageState;

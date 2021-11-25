import { TradingPosition } from '../../../../../types/trading-position';
import { Transaction } from '../../../../../store/global/transactions-store/types';
import { PerpetualPageModals, PerpetualTrade } from '../../types';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { Nullable } from '../../../../../types';

export enum TradeDialogStep {
  review = 'review',
  approval = 'approval',
  processing = 'processing',
}

export type TradeAnalysis = {
  amountChange: number;
  amountTarget: number;
  marginChange: number;
  marginTarget: number;
  partialUnrealizedPnL: number;
  leverageTarget: number;
  entryPrice: number;
  liquidationPrice: number;
  tradingFee: number;
};

export enum PerpetualTxMethods {
  trade = 'trade',
  deposit = 'deposit',
  withdraw = 'withdraw',
  withdrawPercentage = 'withdrawPercentage',
  withdrawAll = 'withdrawAll',
}

export type PerpetualTxTrade = {
  method: PerpetualTxMethods.trade;
  /** amount as wei string */
  amount: string;
  leverage?: number;
  slippage?: number;
  tradingPosition?: TradingPosition;
  isClosePosition?: boolean;
  tx: Nullable<Transaction>;
};

export type PerpetualTxDepositMargin = {
  method: PerpetualTxMethods.deposit;
  /** amount as wei string */
  amount: string;
  tx: Nullable<Transaction>;
};

export type PerpetualTxWithdrawMargin = {
  method: PerpetualTxMethods.withdraw;
  /** amount as wei string */
  amount: string;
  tx: Nullable<Transaction>;
};

export type PerpetualTxWithdrawAllMargin = {
  method: PerpetualTxMethods.withdrawAll;
  tx: Nullable<Transaction>;
};

export type PerpetualTx =
  | PerpetualTxTrade
  | PerpetualTxDepositMargin
  | PerpetualTxWithdrawMargin
  | PerpetualTxWithdrawAllMargin;

export type TradeDialogContextType = {
  pair: PerpetualPair;
  origin?: PerpetualPageModals;
  trade?: PerpetualTrade;
  analysis: TradeAnalysis;
  transactions: PerpetualTx[];
  onClose: () => void;
};

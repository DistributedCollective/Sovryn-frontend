import { TradingPosition } from '../../../../../types/trading-position';
import { Transaction } from '../../../../../store/global/transactions-store/types';
import { PerpetualPageModals, PerpetualTrade } from '../../types';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { Nullable } from '../../../../../types';

export enum TradeDialogStep {
  review = 'review',
  approval = 'approval',
  confirmation = 'confirmation',
  transaction = 'transaction',
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

export enum PerpetualTxStage {
  /** Transaction has been reviewed by the user */
  reviewed = 'reviewed',
  /** Transaction requires spending approval, spending approval requested */
  approvalPending = 'approvalPending',
  /** Transaction spending approval received */
  approvalSuccess = 'approvalSuccess',
  /** Transaction spending approval denied */
  approvalFailure = 'approvalFailure',
  /** Transaction confirmation pending  */
  confirmationPending = 'confirmationPending',
  /** Transaction confirmation denied */
  confirmationFailure = 'confirmationFailure',
  /** Transaction send */
  transactionPending = 'transactionPending',
  /** Transaction confirmed */
  transactionSuccess = 'transactionSuccess',
  /** Transaction failed */
  transactionFailure = 'transactionFailure',
}

export type TradeDialogCurrentTransaction = {
  index: number;
  stage: PerpetualTxStage;
};

export type TradeDialogContextType = {
  pair: PerpetualPair;
  origin?: PerpetualPageModals;
  trade?: PerpetualTrade;
  analysis: TradeAnalysis;
  transactions: PerpetualTx[];
  currentTransaction?: TradeDialogCurrentTransaction;
  setTransactions: (txs: PerpetualTx[]) => void;
  setCurrentTransaction: (next: TradeDialogCurrentTransaction) => void;
  onClose: () => void;
};

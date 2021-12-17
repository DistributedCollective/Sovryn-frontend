import { TradingPosition } from '../../../../../types/trading-position';
import { PerpetualPageModals, PerpetualTrade } from '../../types';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { Nullable } from '../../../../../types';
import { Dispatch, SetStateAction } from 'react';

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
  limitPrice: number;
  liquidationPrice: number;
  orderCost: number;
  tradingFee: number;
};

export enum PerpetualTxMethods {
  trade = 'trade',
  deposit = 'deposit',
  withdraw = 'withdraw',
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
  tx: Nullable<string>;
  approvalTx: Nullable<string>;
};

export type PerpetualTxDepositMargin = {
  method: PerpetualTxMethods.deposit;
  /** amount as wei string */
  amount: string;
  tx: Nullable<string>;
  approvalTx: Nullable<string>;
};

export type PerpetualTxWithdrawMargin = {
  method: PerpetualTxMethods.withdraw;
  /** amount as wei string */
  amount: string;
  tx: Nullable<string>;
};

export type PerpetualTxWithdrawAllMargin = {
  method: PerpetualTxMethods.withdrawAll;
  tx: Nullable<string>;
};

export type PerpetualTx =
  | PerpetualTxTrade
  | PerpetualTxDepositMargin
  | PerpetualTxWithdrawMargin
  | PerpetualTxWithdrawAllMargin;

export enum PerpetualTxStage {
  reviewed = 'reviewed',
  approved = 'approved',
  confirmed = 'confirmed',
}

export type TradeDialogCurrentTransaction = {
  nonce: number;
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
  setTransactions: Dispatch<SetStateAction<PerpetualTx[]>>;
  setCurrentTransaction: Dispatch<
    SetStateAction<TradeDialogCurrentTransaction | undefined>
  >;
  onClose: () => void;
};

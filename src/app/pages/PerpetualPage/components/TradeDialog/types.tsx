import { TradingPosition } from '../../../../../types/trading-position';
import { PerpetualPageModals, PerpetualTrade } from '../../types';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { Nullable } from '../../../../../types';
import { Dispatch, SetStateAction } from 'react';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';

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

interface PerpetualTxBase {
  pair: PerpetualPairType;
  method: PerpetualTxMethods;
  tx: Nullable<string>;
  origin?: PerpetualPageModals;
  index?: number;
  count?: number;
  target?: {
    leverage: number;
  };
}

export interface PerpetualTxTrade extends PerpetualTxBase {
  method: PerpetualTxMethods.trade;
  /** amount as wei string */
  amount: string;
  leverage?: number;
  slippage?: number;
  tradingPosition?: TradingPosition;
  isClosePosition?: boolean;
  keepPositionLeverage?: boolean;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxDepositMargin extends PerpetualTxBase {
  method: PerpetualTxMethods.deposit;
  /** amount as wei string */
  amount: string;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxWithdrawMargin extends PerpetualTxBase {
  method: PerpetualTxMethods.withdraw;
  /** amount as wei string */
  amount: string;
}

export interface PerpetualTxWithdrawAllMargin extends PerpetualTxBase {
  method: PerpetualTxMethods.withdrawAll;
}

export type PerpetualTx =
  | PerpetualTxTrade
  | PerpetualTxDepositMargin
  | PerpetualTxWithdrawMargin
  | PerpetualTxWithdrawAllMargin;

export const isPerpetualTx = (x: any): x is PerpetualTx =>
  x && typeof x === 'object' && PerpetualTxMethods[x.method] !== undefined;

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

export const isTrade = (
  transaction: PerpetualTx,
): transaction is PerpetualTxTrade =>
  transaction.method === PerpetualTxMethods.trade;

export const isDepositMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxDepositMargin =>
  transaction.method === PerpetualTxMethods.deposit;

export const isWithdrawMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxWithdrawMargin =>
  transaction.method === PerpetualTxMethods.withdraw;

export const isWithdrawAllMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxWithdrawAllMargin =>
  transaction.method === PerpetualTxMethods.withdrawAll;

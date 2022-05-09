import { TradingPosition } from '../../../../../types/trading-position';
import { PerpetualPageModals, PerpetualTrade } from '../../types';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { Nullable } from '../../../../../types';
import { Dispatch, SetStateAction } from 'react';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';

export enum TradeDialogStep {
  review = 'review',
  approval = 'approval',
  confirmationEven = 'confirmationEven',
  confirmationOdd = 'confirmationOdd',
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
  requiredAllowance: number;
  tradingFee: number;
  loading: boolean;
};

export enum PerpetualTxMethod {
  trade = 'trade',
  createLimitOrder = 'createLimitOrder',
  cancelLimitOrder = 'cancelLimitOrder',
  deposit = 'deposit',
  withdraw = 'withdraw',
  withdrawAll = 'withdrawAll',
}

interface PerpetualTxBase {
  pair: PerpetualPairType;
  method: PerpetualTxMethod;
  tx: Nullable<string>;
  origin?: PerpetualPageModals;
  index?: number;
  count?: number;
  target?: {
    leverage: number;
  };
}

export interface PerpetualTxTrade extends PerpetualTxBase {
  method: PerpetualTxMethod.trade;
  /** amount as wei string */
  amount: string;
  leverage?: number;
  slippage?: number;
  tradingPosition?: TradingPosition;
  isClosePosition?: boolean;
  keepPositionLeverage?: boolean;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxCreateLimitOrder extends PerpetualTxBase {
  method: PerpetualTxMethod.createLimitOrder;
  /** amount as wei string */
  amount: string;
  /** limit as wei string */
  limit: string;
  /** trigger as wei string */
  trigger: string;
  expiry: number;
  created: number;
  leverage?: number;
  tradingPosition?: TradingPosition;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxCancelLimitOrder extends PerpetualTxBase {
  method: PerpetualTxMethod.cancelLimitOrder;
  /** LimitOrder digest/id */
  digest: string;
}

export interface PerpetualTxDepositMargin extends PerpetualTxBase {
  method: PerpetualTxMethod.deposit;
  /** amount as wei string */
  amount: string;

  approvalTx: Nullable<string>;
}

export interface PerpetualTxWithdrawMargin extends PerpetualTxBase {
  method: PerpetualTxMethod.withdraw;
  /** amount as wei string */
  amount: string;
}

export interface PerpetualTxWithdrawAllMargin extends PerpetualTxBase {
  method: PerpetualTxMethod.withdrawAll;
}

export type PerpetualTx =
  | PerpetualTxTrade
  | PerpetualTxCreateLimitOrder
  | PerpetualTxCancelLimitOrder
  | PerpetualTxDepositMargin
  | PerpetualTxWithdrawMargin
  | PerpetualTxWithdrawAllMargin;

export const isPerpetualTx = (x: any): x is PerpetualTx =>
  x && typeof x === 'object' && PerpetualTxMethod[x.method] !== undefined;

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
  transaction.method === PerpetualTxMethod.trade;

export const isDepositMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxDepositMargin =>
  transaction.method === PerpetualTxMethod.deposit;

export const isWithdrawMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxWithdrawMargin =>
  transaction.method === PerpetualTxMethod.withdraw;

export const isWithdrawAllMargin = (
  transaction: PerpetualTx,
): transaction is PerpetualTxWithdrawAllMargin =>
  transaction.method === PerpetualTxMethod.withdrawAll;

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
  roe: number;
  leverageTarget: number;
  entryPrice: number;
  liquidationPrice: number;
  tradingFee: number;
};

export type PerpetualTxTrade = {
  method: 'trade';
  /** amount as wei string */
  amount: string;
  leverage?: number;
  slippage?: number;
  tradingPosition?: TradingPosition;
  isClosePosition?: boolean;
};

export type PerpetualTxDepositMargin = {
  method: 'deposit';
  /** amount as wei string */
  amount: string;
};

export type PerpetualTxWithrawMargin = {
  method: 'withdraw';
  /** amount as wei string */
  amount: string;
};

export type PerpetualTxWithrawAllMargin = {
  method: 'withdrawAll';
};

export type PerpetualTx = (
  | PerpetualTxTrade
  | PerpetualTxDepositMargin
  | PerpetualTxWithrawMargin
  | PerpetualTxWithrawAllMargin
) & {
  tx: Nullable<Transaction>;
};

export type TradeDialogContextType = {
  pair: PerpetualPair;
  origin?: PerpetualPageModals;
  trade?: PerpetualTrade;
  analysis: TradeAnalysis;
  transactions: PerpetualTx[];
  onClose: () => void;
};

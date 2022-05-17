import {
  PerpetualPageModals,
  PerpetualTrade,
  TradeAnalysis,
  PerpetualTx,
} from '../../types';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { Dispatch, SetStateAction } from 'react';

export enum TradeDialogStep {
  review = 'review',
  approval = 'approval',
  confirmationEven = 'confirmationEven',
  confirmationOdd = 'confirmationOdd',
  transaction = 'transaction',
}

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

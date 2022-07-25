/* --- STATE --- */
import { Asset } from 'types/asset';
import { Nullable } from 'types';
import { LendingHistoryType } from 'utils/graphql/rsk/generated';

export interface LendingPageState {
  asset: Asset;
  collateral: Nullable<Asset>;
  lendAmount: string;
  repayItem: Nullable<string>;
  repayModalOpen: boolean;
}

export enum ButtonType {
  DEPOSIT = 'deposit',
  REDEEM = 'redeem',
}

export interface LendingEvent {
  amount: string;
  asset: string;
  emittedBy: string;
  loanTokenAmount: string;
  txHash: string;
  timestamp: number;
  type: LendingHistoryType;
}

export type ContainerState = LendingPageState;

export enum DialogType {
  NONE,
  ADD,
  REMOVE,
}

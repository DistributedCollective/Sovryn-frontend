/* --- STATE --- */
import { Asset } from 'types/asset';
import { Nullable } from 'types';

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
  asset_amount: string;
  contract_address: string;
  event: LendingEventType;
  time: string;
  token_amount: string;
  txHash: string;
}

export enum LendingEventType {
  MINT = 'Mint',
  BURN = 'Burn',
}

export type ContainerState = LendingPageState;

export enum DialogType {
  NONE,
  ADD,
  REMOVE,
}

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
  event: string;
  time: number;
  token_amount: string;
  txHash: string;
}

export type ContainerState = LendingPageState;

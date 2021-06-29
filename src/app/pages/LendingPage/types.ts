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

export type ContainerState = LendingPageState;

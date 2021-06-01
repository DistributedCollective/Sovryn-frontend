/* --- STATE --- */
import { Asset } from 'types/asset';
import { Nullable } from 'types';

export interface LendingPageState {
  tab: TabType;
  asset: Asset;
  collateral: Nullable<Asset>;
  lendAmount: string;
  borrowAmount: string;
  repayItem: Nullable<string>;
  repayModalOpen: boolean;
}

export enum TabType {
  LEND = 'lend',
  BORROW = 'borrow',
}

export enum ButtonType {
  DEPOSIT = 'deposit',
  REDEEM = 'redeem',
}

export type ContainerState = LendingPageState;

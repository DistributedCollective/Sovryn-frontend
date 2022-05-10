/* --- STATE --- */
import { Asset } from 'types/asset';
import { Nullable } from 'types';

export interface LendBorrowSovrynState {
  asset: Asset;
  collateral: Nullable<Asset>;
  lendAmount: string;
  borrowAmount: string;
  repayItem: Nullable<string>;
  repayModalOpen: boolean;
  addItem: Nullable<string>;
  addModalOpen: boolean;
}

export enum TabType {
  LEND = 'lend',
  BORROW = 'borrow',
}

export enum ButtonType {
  DEPOSIT = 'deposit',
  REDEEM = 'redeem',
  BORROW = 'borrow',
  REPAY = 'repay',
}

export type ContainerState = LendBorrowSovrynState;

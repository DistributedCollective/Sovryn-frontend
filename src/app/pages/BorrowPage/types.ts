import { Nullable } from 'types';
/* --- STATE --- */
import { Asset } from 'types/asset';

export interface BorrowSovrynState {
  asset: Asset;
  collateral: Nullable<Asset>;
  lendAmount: string;
  borrowAmount: string;
  repayItem: Nullable<string>;
  repayModalOpen: boolean;
}

export enum ButtonType {
  DEPOSIT = 'deposit',
  REDEEM = 'redeem',
  BORROW = 'borrow',
  REPAY = 'repay',
}

export type ContainerState = BorrowSovrynState;

/* --- STATE --- */
import { Asset } from 'types/asset';
import { Nullable } from 'types';

export interface LendBorrowSovrynState {
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

export type ContainerState = LendBorrowSovrynState;

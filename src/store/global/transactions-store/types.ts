/* --- STATE --- */
import { Nullable } from 'types';
import { Asset } from 'types/asset';

export interface TransactionsStoreState {
  transactionStack: string[];
  transactions: Transactions;
  loading: boolean;
  requestDialog: RequestDialogState;
}

export type ContainerState = TransactionsStoreState;

export enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
  UNLEND = 'unlend',
  TRADE = 'trade',
  CLOSE_WITH_DEPOSIT = 'close_with_deposit',
  CLOSE_WITH_SWAP = 'close_with_swap',
  BORROW = 'borrow',
  ADD_LIQUIDITY = 'add_liquidity',
  REMOVE_LIQUIDITY = 'remove_liquidity',
  DEPOSIT_COLLATERAL = 'deposit_collateral',
  CONVERT_BY_PATH = 'convert_by_path', // swap
  OTHER = 'other',
}

export enum TxStatus {
  NONE = 'none',
  PENDING_FOR_USER = 'pending_for_user',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface Transactions {
  [transactionHash: string]: Transaction;
}

export interface Transaction {
  transactionHash: string;
  approveTransactionHash: Nullable<string>;
  type: TxType;
  status: TxStatus;
  loading: boolean;
  to: string;
  from: string;
  value: string;
  asset: Nullable<Asset>;
  assetAmount: Nullable<string>;
}

export interface RequestDialogState {
  open: boolean;
  type: TxType;
  asset: Nullable<Asset>;
  amount: string;
  error: Nullable<string>;
}

/* --- STATE --- */
import { Nullable } from 'types';
import { Asset } from 'types/asset';

export interface TransactionsStoreState {
  transactionStack: string[];
  transactions: Transactions;
}

export type ContainerState = TransactionsStoreState;

export enum TxType {
  APPROVE,
  LEND,
  UNLEND,
  TRADE,
  SWAP,
  CLOSE_WITH_DEPOSIT,
  CLOSE_WITH_SWAP,
  BORROW,
  REPAY,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
}

export enum TxStatus {
  PENDING_FOR_USER,
  PENDING,
  CONFIRMED,
  FAILED,
}

export interface Transactions {
  [transactionHash: string]: Transaction;
}

export interface Transaction {
  transactionHash: string;
  type: TxType;
  status: TxStatus;
  to: string;
  value: string;
  asset: Nullable<Asset>;
  assetAmount: Nullable<string>;
}

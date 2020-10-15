/* --- STATE --- */
import { TransactionStatus } from '../../../types/transaction-status';

export interface TokenSwapContainerState {
  sourceToken: string;
  targetToken: string;
  amount: string;
  path: string[];
  rateByPath: string;
  transactions: SwapTransaction[];
}

export type ContainerState = TokenSwapContainerState;

export interface SwapTransaction {
  status: TransactionStatus;
  txHash: string;
  type: string;
  afterApprove: any;
}

export interface SwapTransactionForm {
  sourceToken: string;
  targetToken: string;
  amount: string;
}

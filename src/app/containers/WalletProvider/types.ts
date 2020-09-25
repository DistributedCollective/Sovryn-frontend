/* --- STATE --- */

export interface WalletProviderState {
  address: string;
  chainId: number;
  networkId: number;
  connected: boolean;
  blockNumber: number;
  syncBlockNumber: number;
  // todo ?
  transactions: any;
  transactionStack: string[];
}

export type ContainerState = WalletProviderState;

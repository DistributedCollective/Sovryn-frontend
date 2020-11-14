/* --- STATE --- */

export interface WalletProviderState {
  address: string;
  chainId: number;
  networkId: number;
  connected: boolean;
  connecting: boolean;
  blockNumber: number;
  syncBlockNumber: number;
  // todo ?
  transactions: any;
  transactionStack: string[];
  // whitelisting
  whitelist: IWhitelist;
}

export type ContainerState = WalletProviderState;

export interface IWhitelist {
  enabled: boolean;
  loading: boolean;
  loaded: boolean;
  whitelisted: boolean;
  isDialogOpen: boolean;
}

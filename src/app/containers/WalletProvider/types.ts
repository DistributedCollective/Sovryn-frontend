/* --- STATE --- */

import { Asset } from '../../../types';
import { Nullable } from '../../../types';

export interface WalletProviderState {
  address?: string;
  chainId?: number;
  networkId?: number;
  bridgeChainId: Nullable<number>;
  signTypedRequired: boolean;
  connected: boolean;
  connecting: boolean;
  blockNumber: number;
  syncBlockNumber: number;
  // todo ?
  transactions: any;
  transactionStack: string[];
  assetRates: CachedAssetRate[];
  assetRatesLoading: boolean;
  assetRatesLoaded: boolean;
  processedBlocks: number[];
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

export interface CachedAssetRate {
  source: Asset;
  target: Asset;
  value: {
    precision: string;
    rate: string;
  };
}

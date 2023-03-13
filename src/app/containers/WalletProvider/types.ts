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
  // notifications
  notificationWallet?: string;
  notificationToken?: string;
  notificationUser?: NotificationUser;
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

export type NotificationUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  email?: string;
  emailNotificationLastSent?: string;
  discordHandle?: string;
  discordNotificationLastSent?: string;
  telegramHandle?: string;
  telegramNotificationLastSent?: string;
  isDiscordNotifications: boolean;
  isEmailNotifications: boolean;
  isTelegramNotifications: boolean;
  subscriptions: Subscription[];
  role: string;
};

export enum Notification {
  MarginCall = 'Margin_Call',
  Liquidation = 'Liquidation',
  SpotOrderFilled = 'SpotOrderFilled',
  MarginOrderFilled = 'MarginOrderFilled',
  MarginUndercollateralized = 'MarginUndercollateralized',
}

export type Subscription = {
  notification: Notification;
  isSubscribed: boolean;
  userId: string;
};

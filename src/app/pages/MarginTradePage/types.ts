/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { BigNumber } from 'ethers';

export const MARGIN_SLIPPAGE_DEFAULT = 0.5;
export const PAGE_SIZE = 5;

export const DEFAULT_TRADE = {
  entryPrice: '0',
  entryLeverage: 1,
  positionSize: '0',
  loanPrincipal: '0',
  loanCurrentMargin: '0',
  loanCollateral: '0',
  transactionId: '',
  interestRate: '0',
};

export interface IMarginTradePageState {
  pairType: TradingPairType;
  collateral: Asset;
  amount: string;
  leverage: number;
  position: TradingPosition;
  notificationWallet?: string;
  notificationToken?: string;
  notificationUser?: NotificationUser;
  pendingLimitOrders: MarginLimitOrder[];
}

export type MarginLimitOrder = {
  hash?: string;
  transactionHash?: string;
  loanId: string;
  leverageAmount: BigNumber | string;
  loanTokenAddress: string;
  loanTokenSent: BigNumber | string;
  collateralTokenSent: BigNumber | string;
  collateralTokenAddress: string;
  trader: string;
  minEntryPrice: BigNumber | string;
  loanDataBytes: string;
  deadline: BigNumber | string;
  createdTimestamp: BigNumber | string;
  v: string;
  r: string;
  s: string;
  canceled?: boolean;
  filledAmount?: string;
  filled?: BigNumber | string;
};

export type NotificationPayload = {
  token: string;
  wallet: string;
};

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

export enum EventType {
  CLOSED = 'CloseWithSwap',
  TRADE = 'Trade',
  LIQUIDATE = 'Liquidate',
  DEPOSIT = 'DepositCollateral',
}

export enum TradeType {
  'SHORT' = 'short',
  'LONG' = 'long',
}

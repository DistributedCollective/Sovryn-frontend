/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { BigNumber } from 'ethers';

export const MARGIN_SLIPPAGE_DEFAULT = 0.5;

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
  role: string;
};

export enum EventType {
  CLOSED = 'CloseWithSwap',
  TRADE = 'Trade',
  LIQUIDATE = 'Liquidate',
}

export enum TradeType {
  'SHORT' = 'short',
  'LONG' = 'long',
}

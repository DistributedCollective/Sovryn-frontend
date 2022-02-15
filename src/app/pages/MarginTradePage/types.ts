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
}

type ApiBigNumber = {
  hex: string;
};

export type MarginLimitOrder = {
  hash?: string;
  loanId: string;
  leverageAmount: BigNumber;
  loanTokenAddress: string;
  loanTokenSent: BigNumber;
  collateralTokenSent: BigNumber;
  collateralTokenAddress: string;
  trader: string;
  minReturn: BigNumber;
  loanDataBytes: string;
  deadline: BigNumber;
  createdTimestamp: BigNumber;
  v: string;
  r: string;
  s: string;
  canceled?: boolean;
  filledAmount?: string;
  filled?: BigNumber;
};

export type ApiMarginLimitOrder = {
  loanId: string;
  leverageAmount: ApiBigNumber;
  loanTokenAddress: string;
  loanTokenSent: ApiBigNumber;
  collateralTokenSent: ApiBigNumber;
  collateralTokenAddress: string;
  trader: string;
  minReturn: ApiBigNumber;
  loanDataBytes: string;
  deadline: ApiBigNumber;
  createdTimestamp: ApiBigNumber;
  v: string;
  r: string;
  s: string;
  hash: string;
  canceled: boolean;
  filled: ApiBigNumber;
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

export enum TradePriceChange {
  'UP' = 'up',
  'DOWN' = 'down',
  'NO_CHANGE' = 'noChange',
}

export enum TradeType {
  'SHORT' = 'short',
  'LONG' = 'long',
}

export type RecentTradesDataEntry = {
  collateralToken: string;
  entryPrice: string;
  loanToken: string;
  positionSize: string;
  timestamp: string;
  priceChange: TradePriceChange;
};

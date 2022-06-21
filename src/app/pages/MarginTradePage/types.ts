/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { BigNumber } from 'ethers';

export const MARGIN_SLIPPAGE_DEFAULT = 0.5;
export const PAGE_SIZE = 5;

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
  role: string;
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

export type LoanEvent = {
  id: string;
  type: EventType;
  trade: EventTrade[];
  isOpen: boolean;
  loanToken: {
    id: string;
  };
  liquidates: EventLiquidates[];
  nextRollover: number;
  startTimestamp: number;
  closeWithSwaps: EventCloseWithSwaps[];
  collateralToken: {
    id: string;
  };
  depositCollateral: EventDepositCollateral[];
  closewithDeposits: EventCloseWithDeposit[];
};

export type EventTrade = {
  id: string;
  loanToken: {
    id: string;
  };
  timestamp: number;
  transaction: {
    id: string;
  };
  __typename: EventType;
  entryPrice: string;
  positionSize: string;
  interestRate: string;
  entryLeverage: string;
  borrowedAmount: string;
  collateralToken: {
    id: string;
  };
};

export type EventLiquidates = {
  id: string;
  timestamp: number;
  loanToken: string;
  __typename: EventType;
  transaction: {
    id: string;
  };
  currentMargin: string;
  collateralToken: string;
  collateralToLoanRate: string;
  collateralWithdrawAmount: string;
};

export type EventCloseWithSwaps = {
  id: string;
  exitPrice: string;
  loanToken: string;
  timestamp: number;
  __typename: EventType;
  transaction: {
    id: string;
  };
  collateralToken: string;
  loanCloseAmount: string;
  currentLeverage: string;
  positionCloseSize: string;
};

export type EventCloseWithDeposit = {
  id: string;
  loanToken: string;
  timestamp: number;
  __typename: EventType;
  transaction: {
    id: string;
  };
  collateralToken: string;
  collateralToLoanRate: string;
  collateralWithdrawAmount: string;
};

export type EventDepositCollateral = {
  id: string;
  loanId: {
    id: string;
  };
  timestamp: number;
  __typename: EventType;
  transaction: {
    id: string;
  };
  depositAmount: string;
};

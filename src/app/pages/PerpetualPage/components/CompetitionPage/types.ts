import { Nullable } from 'types';

export type LeaderboardData = {
  rank: string;
  userName: string | null;
  walletAddress: string;
  openedPositions: number;
  lastTrade: number;
  totalPnL: number;
  totalPnLCC?: number;
  totalFundingPaymentCC?: number;
  realizedProfitCC?: number;
  unrealizedPnLCC?: number;
};

export type HighestVolumeData = {
  rank: string;
  userName: Nullable<string>;
  walletAddress: string;
  volume: number;
};

export type RegisteredTraderData = {
  createdAt: string; //timestamp
  id: string; //uuid
  updatedAt: string; //timestamp
  userName: string | null;
  walletAddress: string;
};

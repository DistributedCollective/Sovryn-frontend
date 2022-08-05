import { Nullable } from 'types';

export type CommonRankingData = {
  rank: string;
  userName: Nullable<string>;
  walletAddress: string;
};

export type LeaderboardData = CommonRankingData & {
  openedPositions: number;
  lastTrade: number;
  totalPnL: number;
  totalPnLCC?: number;
  totalFundingPaymentCC?: number;
  realizedProfitCC?: number;
  unrealizedPnLCC?: number;
};

export type HighestVolumeData = CommonRankingData & {
  volume: number;
};

export type RegisteredTraderData = {
  createdAt: string; //timestamp
  id: string; //uuid
  updatedAt: string; //timestamp
  userName: string | null;
  walletAddress: string;
};

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

export type RegisteredTraderData = {
  createdAt: string; //datestamp
  id: string; //uuid
  updatedAt: string; //datestamp
  userName: string | null;
  walletAddress: string;
};

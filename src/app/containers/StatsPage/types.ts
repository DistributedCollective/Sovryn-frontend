export type TradingVolumeData = {
  total: {
    btc: {
      allTime: number;
      twentyFourHours: number;
    };
    usd: {
      allTime: number;
      twentyFourHours: number;
    };
  };
};

export type TvlData = {
  tvlLending: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlAmm: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlProtocol: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlStaking: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlSubprotocols: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlZero: {
    totalBtc: number;
    totalUsd: number;
  };
  total_btc: number;
  total_usd: number;
};

export type TvlContract =
  | 'tvlProtocol'
  | 'tvlAmm'
  | 'tvlLending'
  | 'tvlStaking'
  | 'tvlSubprotocols';

type AmmAPY = {
  activity_date: string;
  apy: number;
  pool: string;
  pool_token: string;
};
export type AmmBalanceRow = {
  ammPool: string;
  ammRateBtc: number;
  ammRateToken: number;
  btcDelta: number;
  contractBalanceBtc: number;
  contractBalanceToken: number;
  stakedBalanceBtc: number;
  stakedBalanceToken: number;
  tokenDelta: number;
  yesterdayApy: AmmAPY[];
};

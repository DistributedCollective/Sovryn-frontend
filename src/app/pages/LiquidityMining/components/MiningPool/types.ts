export type ChartDatum = [number, number]; //[unix timestamp, value]
export type ChartData = ChartDatum[];

export type PoolData = {
  pool_token: string;
  activity_date: string;
  APY_fees_pc: string;
  APY_rewards_pc: string;
  APY_pc: string;
};

export type PoolBalanceData = {
  activity_date: string;
  balance_btc: number;
  pool: string;
};

export type AmmHistory = {
  pool: string;
  data: {
    [key: string]: PoolData[];
  };
  balanceHistory: PoolBalanceData[];
};

export type UserInfo = {
  amount: string;
  accumulatedReward: string;
};

export type Balance = {
  0: string;
};

export enum DialogType {
  NONE,
  ADD,
  REMOVE,
}

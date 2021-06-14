export interface PoolData {
  [pool: string]: {
    oracleRate: string;
    negativeDelta: boolean;
    rateToBalance: {
      amount: number;
      from: string;
      to: string;
      rate: number;
      earn: number;
    };
  };
}

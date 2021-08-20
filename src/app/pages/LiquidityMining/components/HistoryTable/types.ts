export interface LiquidityMiningEvent {
  amount: string;
  asset: string;
  pool: string;
  time: number;
  txHash: string;
  type: string;
}

interface Pagination {
  page: string;
  totalPages: number;
}

export interface LiquidityMiningHistory {
  events: LiquidityMiningEvent[];
  pagination: Pagination;
}

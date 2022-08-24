export type LoanTokenGraphItem = {
  supply: string;
  supply_apr: string;
  borrow_apr: string;
  timestamp: string;
};

export type BarsGraphProps = {
  width: number;
  data: LoanTokenGraphItem[];
};

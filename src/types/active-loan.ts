export interface ActiveLoan {
  collateral: string;
  collateralToken: string;
  currentMargin: string;
  endTimestamp: string;
  interestDepositRemaining: string;
  interestOwedPerDay: string;
  loanId: string;
  loanToken: string;
  maintenanceMargin: string;
  maxLiquidatable: string;
  maxLoanTerm: string;
  maxSeizable: string;
  principal: string;
  startMargin: string;
  startRate: string;
  // new properties available using getUserLoansV2
  // https://github.com/DistributedCollective/Sovryn-smart-contracts/pull/412
  borrower: string;
  creationTimestamp: string;
}

export interface TradeEventData {
  borrowedAmount: string;
  collateralToken: string;
  currentLeverage: string;
  entryLeverage: string;
  entryPrice: string;
  interestRate: string;
  lender: string;
  loanId: string;
  loanToken: string;
  positionSize: string;
  settlementDate: string;
  user: string;
}

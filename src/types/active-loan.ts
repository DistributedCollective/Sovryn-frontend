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
}

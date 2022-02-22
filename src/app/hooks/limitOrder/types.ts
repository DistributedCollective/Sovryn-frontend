export type ApiBigNumber = {
  hex: string;
};

export type ApiLimitMarginOrder = {
  hash: string;
  loanId: string;
  loanTokenAddress: string;
  collateralTokenAddress: string;
  trader: string;
  loanDataBytes: string;
  leverageAmount: ApiBigNumber;
  loanTokenSent: ApiBigNumber;
  collateralTokenSent: ApiBigNumber;
  minEntryPrice: ApiBigNumber;
  deadline: ApiBigNumber;
  createdTimestamp: ApiBigNumber;
  v: string;
  r: string;
  s: string;
  canceled: boolean;
  filled: ApiBigNumber;
  filledAmount?: string;
};

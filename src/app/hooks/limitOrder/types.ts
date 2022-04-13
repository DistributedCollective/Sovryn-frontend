export type IApiBigNumber = {
  hex: string;
};

export type IApiLimitMarginOrder = {
  hash: string;
  loanId: string;
  loanTokenAddress: string;
  collateralTokenAddress: string;
  trader: string;
  loanDataBytes: string;
  leverageAmount: IApiBigNumber;
  loanTokenSent: IApiBigNumber;
  collateralTokenSent: IApiBigNumber;
  minEntryPrice: IApiBigNumber;
  deadline: IApiBigNumber;
  createdTimestamp: IApiBigNumber;
  v: string;
  r: string;
  s: string;
  canceled: boolean;
  filled: IApiBigNumber;
  filledAmount?: string;
};

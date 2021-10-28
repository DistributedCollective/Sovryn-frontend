export type gqlTestExchangeRateData = {
  loading: boolean;
  error: boolean;
  exchangeRatesData: exchangeRatesData[] | undefined;
};

export type exchangeRatesData = {
  currency: string | undefined;
  rate: string | undefined;
};

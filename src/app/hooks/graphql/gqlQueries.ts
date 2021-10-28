import { gql } from '@apollo/client';

const TEST_QUERY_EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

export { TEST_QUERY_EXCHANGE_RATES };

import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import { TEST_QUERY_EXCHANGE_RATES } from './gqlQueries';
import { gqlTestExchangeRateData, exchangeRatesData } from './gqlQueryTypes';

export const apolloTestClient = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});

export const apolloUniSwapClient = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});

export const testConnectionQuery = () => {
  apolloTestClient
    .query({
      query: gql`
        query GetRates {
          rates(currency: "USD") {
            currency
          }
        }
      `,
    })
    .then(result => console.log(result));
};

function TestConnectionHook() {
  const { loading, error, data } = useQuery(TEST_QUERY_EXCHANGE_RATES);
  let returnData: gqlTestExchangeRateData = {
    loading: true,
    error: false,
    exchangeRatesData: [],
  };
  let exchangeRate: exchangeRatesData = {
    currency: undefined,
    rate: undefined,
  };

  if (loading) {
    returnData.loading = true;
    return returnData;
  }
  if (error) {
    returnData.loading = false;
    returnData.error = true;
    return returnData;
  }
  data.rates.forEach(function (item, index) {
    exchangeRate.currency = item.currency;
    exchangeRate.rate = item.rate;
    returnData.exchangeRatesData?.push(exchangeRate);
  });
  return returnData;
}

export { TestConnectionHook };

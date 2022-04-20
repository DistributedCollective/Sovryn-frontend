import { useQuery, gql } from '@apollo/client';

/**
 * TODO:
 *  - include the rest of the fields when available: createdAt
 *  - sort by createdAt desc
 * */
const RECENT_LIMIT_ORDERS = gql`
  query RecentLimitOrders($trader: String!, $first: Int!, $skip: Int!) {
    limitOrders(
      where: { trader: $trader }
      first: $first
      skip: $skip
      orderDirection: desc
    ) {
      id
      trader {
        id
      }
      perpetual {
        id
      }
      limitPrice
      triggerPrice
    }
  }
`;

/** Hook to get limit orders of the trader
 */
export function useGetOpenOrders(
  trader: string,
  first: number = 50,
  skip: number = 0,
) {
  const limitOrders = useQuery(RECENT_LIMIT_ORDERS, {
    variables: { trader, first, skip },
  });
  return limitOrders;
}

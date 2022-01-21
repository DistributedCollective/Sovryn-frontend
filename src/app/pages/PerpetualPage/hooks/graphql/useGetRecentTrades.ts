import { useQuery, gql } from '@apollo/client';

/** Hook to get recent trades for right hand panel
 * Takes count as parameters: number of rows to return, perpetualId
 * Default is 20
 */

export function useGetRecentTrades(perpetualId: string, count: number = 20) {
  const RECENT_TRADES_QUERY = gql`
    {
      trades(
        first: ${count}
        where: {
          perpetual: "${perpetualId}"
        }
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        trader {
          id
        }
        perpetual {
          id
        }
        tradeAmountBC
        price
        blockTimestamp
        transaction {
          id
        }
      }
    }
  `;
  const recentTradesQuery = useQuery(RECENT_TRADES_QUERY);
  return recentTradesQuery;
}

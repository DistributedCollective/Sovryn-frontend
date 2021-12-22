import { useQuery, gql } from '@apollo/client';

/**
 * Hook to retrieve trade data for a list of trader IDs (wallet addresses)
 */

export function useGetLeaderboardData(traderIDs: string[]) {
  const TRADER_DATA_QUERY = gql`
  {
    traders(where: { id_in: ["${traderIDs.join(`","`)}"]}) {
      id
      totalPnLCC
      totalFundingPaymentCC
      positionsTotalCount
      positions(orderBy: lastChanged, orderDirection: desc) {
        currentPositionSizeBC
        totalPnLCC
        isClosed
        lastChanged
      }
    }
  }
  `;
  const traderDataQuery = useQuery(TRADER_DATA_QUERY);
  return traderDataQuery;
}

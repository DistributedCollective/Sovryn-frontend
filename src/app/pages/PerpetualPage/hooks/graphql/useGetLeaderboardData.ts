import { useQuery, gql } from '@apollo/client';

/**
 * Hook to retrieve trade data for a list of trader IDs (wallet addresses)
 */

export function useGetLeaderboardData(traderIDs: string[]) {
  const TRADER_DATA_QUERY = gql`
  {
    traders(where: { id_in: ["${traderIDs.join(`","`)}"]}) {
      id
      balance
      totalPnLCC
      totalFundingPaymentCC
      positionsTotalCount
      trades {
        id
        tradeAmountBC
        newPositionSizeBC
        price
        blockTimestamp
      }
    }
  }
  `;
  const traderDataQuery = useQuery(TRADER_DATA_QUERY);
  return traderDataQuery;
}

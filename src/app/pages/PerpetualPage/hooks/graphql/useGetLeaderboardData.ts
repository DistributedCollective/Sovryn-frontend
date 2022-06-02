import { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';

/**
 * Hook to retrieve trade data for a list of trader IDs (wallet addresses)
 */

export function useGetLeaderboardData(
  pairType: PerpetualPairType,
  traderIDs: string[],
) {
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);
  const TRADER_DATA_QUERY = gql`
  {
    traders(
      where: {id_in: ${JSON.stringify(traderIDs)}}
      first: ${traderIDs.length}
    ){
      id
      totalPnLCC
      totalFundingPaymentCC
      positionsTotalCount
      balance
      capitalUsed
      traderState {
        marginBalanceCC
        availableMarginCC
        availableCashCC
        marginAccountCashCC
        marginAccountPositionBC
        marginAccountLockedInValueQC
        fUnitAccumulatedFundingStart
      }
      positions(where: {perpetual: ${JSON.stringify(
        pair.id,
      )}}, orderBy: lastChanged, orderDirection: desc) {
        currentPositionSizeBC
        totalPnLCC
        isClosed
        lastChanged
      }
    }
  }
  `;
  const traderDataQuery = useQuery(TRADER_DATA_QUERY);
  //console.log(traderDataQuery?.data);
  return traderDataQuery;
}

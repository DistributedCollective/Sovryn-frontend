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
  tradesTimestamp: string,
  blockNumber?: string,
) {
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const blockNumberCondition = useMemo(
    () => (blockNumber ? `block:{number: ${blockNumber}}` : ''),
    [blockNumber],
  );

  const TRADER_DATA_QUERY = gql`
  {
    traders(
      where: {id_in: ${JSON.stringify(traderIDs)}}
      first: ${traderIDs.length}
      ${blockNumberCondition}
    ){
      id
      trades(where: {blockTimestamp_gt: ${tradesTimestamp}, perpetual: ${JSON.stringify(
    pair.id,
  )}}) {
        perpetual {
          id
        }
        blockTimestamp
        tradeAmountBC
      }
      totalFundingPaymentCC
      positionsTotalCount
      traderStates (where: {perpetual: ${JSON.stringify(pair.id)}}) {
        marginBalanceCC
        availableMarginCC
        availableCashCC
        marginAccountCashCC
        marginAccountPositionBC
        marginAccountLockedInValueQC
        fUnitAccumulatedFundingStart
        totalPnLCC
        balance
        capitalUsed
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
  const traderDataQuery = useQuery(TRADER_DATA_QUERY, {
    fetchPolicy: 'no-cache',
  });
  //console.log(traderDataQuery?.data);
  return traderDataQuery;
}

import { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';

/**
 * Hook to retrieve realized PnL data for a list of trader IDs (wallet addresses)
 */

export function useGetRealizedPnlData(
  pairType: PerpetualPairType,
  traderIDs: string[],
  tradesTimestamp: string,
) {
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);
  const QUERY = gql`
    {
      realizedPnLs(
        where: {
          blockTimestamp_gt: ${tradesTimestamp}
          perpetual: ${JSON.stringify(pair.id)}
          trader_in: ${JSON.stringify(traderIDs)}
        }
      ) {
        id
        perpetual {
          id
        }
        trader {
          id
        }
        pnlCC
        blockTimestamp
      }
    }
  `;
  const realizedPnlDataQuery = useQuery(QUERY);
  //console.log(traderDataQuery?.data);
  return realizedPnlDataQuery;
}

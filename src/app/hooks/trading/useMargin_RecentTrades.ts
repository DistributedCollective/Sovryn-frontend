import { useEffect } from 'react';
import { RecentTradesDataEntry } from 'types/trading-pairs';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useGetRecentMarginEventsLazyQuery } from 'utils/graphql/rsk/generated';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';

export const useMargin_RecentTrades = (baseToken: Asset, quoteToken: Asset) => {
  const baseTokenAddress = getTokenContract(baseToken).address?.toLowerCase();
  const quoteTokenAddress = getTokenContract(quoteToken).address?.toLowerCase();

  const pool = TradingPairDictionary.findPair(baseToken, quoteToken);

  const [load, { called, data, loading }] = useGetRecentMarginEventsLazyQuery({
    variables: {
      tokens: [pool.longDetails, pool.shortDetails].map(item =>
        item.getTokenContractAddress().toLowerCase(),
      ),
      limit: 100,
    },
  });

  useEffect(() => {
    if (baseTokenAddress && quoteTokenAddress) {
      load();
    }
  }, [load, baseTokenAddress, quoteTokenAddress]);

  return {
    data: (data?.trades || []) as RecentTradesDataEntry[],
    loading: loading && called,
  };
};

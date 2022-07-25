import { bignumber } from 'mathjs';
import { useMemo } from 'react';
import { Asset } from 'types';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useGetTokenQuery } from 'utils/graphql/rsk/generated';

export enum DenominationAsset {
  'BTC' = 'BTC',
  'USD' = 'USD',
}
export const useGetTokenPrice = (
  asset: Asset,
  type: DenominationAsset = DenominationAsset.BTC,
) => {
  const assetDetails = AssetsDictionary.get(asset);
  const { data, loading } = useGetTokenQuery({
    variables: {
      id: assetDetails.getTokenContractAddress().toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });

  const price = useMemo(() => {
    if (loading || !data) {
      return '0';
    }

    const lastPrice =
      type === DenominationAsset.BTC
        ? data?.token?.lastPriceBtc
        : data?.token?.lastPriceUsd;

    return bignumber(lastPrice || 0)
      .mul(1e8)
      .toString();
  }, [data, loading, type]);

  return { value: price, loading };
};

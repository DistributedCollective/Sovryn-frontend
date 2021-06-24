import { useGetActiveSaleTierId } from './useGetActiveSaleTierId';
import { useGetTierCount } from './useGetTierCount';
import { useGetSaleInformation } from './useGetSaleInformation';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { Asset } from 'types';
import { bignumber } from 'mathjs';
import { useEffect, useMemo, useState } from 'react';

export const useGetFishDollarValue = (fishAmount: number) => {
  const [tierId, setTierId] = useState(0);
  const [loading, setLoading] = useState(true);
  const activeSaleTierId = useGetActiveSaleTierId();
  const tierCount = useGetTierCount();

  useEffect(() => {
    if (activeSaleTierId > 0 || tierCount > 0) {
      setTierId(activeSaleTierId || tierCount);
      loading && setLoading(false);
    } else {
      !loading && setLoading(true);
    }
  }, [activeSaleTierId, loading, tierCount]);

  const { depositRate } = useGetSaleInformation(tierId);

  const dollars = useCachedAssetPrice(Asset.RBTC, Asset.USDT);

  const dollarValue = useMemo(
    () =>
      depositRate > 0
        ? bignumber(fishAmount)
            .mul(dollars.value)
            .div(10 ** 18)
            .div(depositRate)
            .toFixed(0)
        : '0',
    [depositRate, dollars.value, fishAmount],
  );

  return {
    value: dollarValue,
    loading: loading || dollars.loading,
  };
};

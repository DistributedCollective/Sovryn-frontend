import { useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { useSwapNetwork_resolveRate } from '../swap-network/useSwapNetwork_resolveRate';
import { usePriceFeeds_QueryRate } from '../price-feeds/useQueryRate';
import { bignumber, abs } from 'mathjs';

const diffPercentage = (A: string, B: string) => {
  // 100 * Math.abs( (A - B) / ( (A+B)/2 ) )
  const a = bignumber(A);
  const b = bignumber(B);

  const ab = a.sub(b);
  const ba = b.add(a);

  const e = abs(ab.div(ba.div(2))).mul(100);
  return Number(e.toFixed(4));
};

interface Response {
  swapRate: string;
  oracleRate: string;
  diff: number;
  loading: boolean;
}

export function useTrading_testRates(
  sourceAsset: Asset,
  destAsset: Asset,
  weiAmount: string,
): Response {
  const [oracleRate, setOracleRate] = useState('0');
  const [diff, setDiff] = useState(0);

  const {
    rate: swapRate,
    loading: loadingAmmRate,
  } = useSwapNetwork_resolveRate(sourceAsset, destAsset, weiAmount);

  const { value, loading: loadingFeedRate } = usePriceFeeds_QueryRate(
    sourceAsset,
    destAsset,
  );

  useEffect(() => {
    const rate = bignumber(value.rate)
      .mul(weiAmount)
      .div(value.precision)
      .toFixed(0);
    setOracleRate(rate === 'NaN' ? '0' : rate);
  }, [value, weiAmount]);

  useEffect(() => {
    setDiff(diffPercentage(swapRate, oracleRate) || 0);
  }, [swapRate, oracleRate]);

  return {
    swapRate,
    oracleRate,
    diff,
    loading: loadingFeedRate || loadingAmmRate,
  };
}

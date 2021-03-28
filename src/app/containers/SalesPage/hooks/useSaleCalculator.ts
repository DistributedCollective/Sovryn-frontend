import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { usePriceFeeds_QueryRate } from '../../../hooks/price-feeds/useQueryRate';
import { Asset } from '../../../../types/asset';
import { useEffect, useState } from 'react';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { bignumber } from 'mathjs';

export function useSaleCalculator(btcAmount: string) {
  const weiAmount = useWeiAmount(btcAmount);
  const [price, setPrice] = useState(0);
  const [priceBtc, setPriceBtc] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [sovToReceive, setSovToReceive] = useState(0);

  const { value: rate, loading: rateLoading } = useCacheCallWithValue(
    'CrowdSale',
    'rate',
    '0',
  );
  const { value: btcRate, loading: btcRateLoading } = usePriceFeeds_QueryRate(
    Asset.RBTC,
    Asset.USDT,
  );

  useEffect(() => {
    setPrice(
      Number(
        bignumber(btcRate.rate)
          .div(btcRate.precision)
          .mul(bignumber(1).div(rate)),
      ),
    );
    setPriceBtc(Number(bignumber(1).div(rate)));
  }, [btcRate, rate]);

  useEffect(() => {
    setSovToReceive(
      Number(
        bignumber(weiAmount)
          .mul(rate)
          .div(10 ** 18),
      ),
    );
  }, [weiAmount, rate]);

  useEffect(() => {
    setTotalPrice(price * sovToReceive);
  }, [sovToReceive, price]);

  return {
    price: totalPrice,
    unitPrice: price,
    unitPriceBtc: priceBtc,
    rate,
    sovToReceive,
    loading: rateLoading || btcRateLoading,
  };
}

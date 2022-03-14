import { Asset } from 'types/asset';
import { fromWei, toWei } from '../../../utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';
import { useCallback, useEffect, useState } from 'react';
import { rateProvider } from '../../../utils/providers/rate-provider';

export function useCurrentPositionPrice(
  sourceAsset: Asset,
  destAsset: Asset,
  weiAmount: string,
  isLong: boolean,
) {
  const [price, setPrice] = useState(0);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const getRate = useCallback(
    async (source: Asset, target: Asset, amount: string) => {
      const response = await rateProvider.getPrice(source, target, amount);
      let _rate = toWei(bignumber(response as string).div(amount));
      try {
        _rate = (await rateProvider.getDisagreementRate(
          source,
          target,
          amount,
        )) as string;
      } catch (e) {
        console.error(e);
      }
      let _price = Number(fromWei(_rate));
      if (!isLong) {
        _price = Number(
          bignumber(1)
            .div(_rate)
            .mul(10 ** 18)
            .toFixed(),
        );
      }
      return {
        price: _price,
        rate: Number(_rate),
      };
    },
    [isLong],
  );

  const calculatePrice = useCallback(
    async (source: Asset, target: Asset, amount: string, isLong: boolean) => {
      if (!amount || amount === '0') {
        amount = toWei(0.01);
      }
      return await getRate(source, target, amount);
    },
    [getRate],
  );

  useEffect(() => {
    setLoading(true);
    calculatePrice(sourceAsset, destAsset, weiAmount, isLong)
      .then(response => {
        setPrice(response.price);
        setRate(response.rate);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [sourceAsset, destAsset, weiAmount, isLong, calculatePrice]);

  return {
    loading,
    price,
    rate,
  };
}

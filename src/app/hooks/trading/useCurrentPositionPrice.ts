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

  const getRate = async (source: Asset, target: Asset, amount: string) => {
    console.group('prices');
    const response = await rateProvider.getPrice(source, target, amount);
    let _rate = toWei(bignumber(response).div(amount));
    try {
      _rate = (await rateProvider.getRate(source, target, amount)) as string;
      console.log('rate blockchain', _rate);
    } catch (e) {
      console.error(e);
    }
    console.log('price blockchain', response);
    console.log('calculated rate', _rate);
    const _price = Number(fromWei(_rate));
    console.log('calculated price', _price);
    console.groupEnd();
    return {
      price: _price,
      rate: Number(_rate),
    };
  };

  const calculatePrice = useCallback(
    async (source: Asset, target: Asset, amount: string, isLong: boolean) => {
      if (!amount || amount === '0') {
        amount = toWei(0.01);
      }
      const response = await getRate(source, target, amount);
      console.log({ amount, source, target, isLong, response });
      // if (!isLong) {
      //   return await getRate(target, source, toWei(response.price));
      // }
      return response;
    },
    [],
  );

  useEffect(() => {
    console.log({ sourceAsset, destAsset, weiAmount, isLong });
    setLoading(true);
    calculatePrice(sourceAsset, destAsset, weiAmount, isLong)
      .then(response => {
        setPrice(response.price);
        setRate(response.rate);
        setLoading(false);
        console.log({ response });
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

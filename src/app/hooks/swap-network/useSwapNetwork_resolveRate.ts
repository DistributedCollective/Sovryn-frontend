import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { contractReader } from 'utils/sovryn/contract-reader';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { bignumber } from 'mathjs';

export function useSwapNetwork_resolveRate(
  sourceAsset: Asset,
  destAsset: Asset,
  weiAmount: string,
) {
  const { syncBlockNumber } = useSelector(selectWalletProvider);

  const [data, setData] = useState('0');
  const [loading, setLoading] = useState<any>('0');

  const getRate = useCallback(async () => {
    const path = await contractReader.call('swapNetwork', 'conversionPath', [
      getTokenContract(sourceAsset).address,
      getTokenContract(destAsset).address,
    ]);
    const rate = await contractReader.call('swapNetwork', 'rateByPath', [
      path,
      weiAmount,
    ]);
    return typeof rate == 'string' ? bignumber(parseInt(rate)).toFixed(0) : '0';
  }, [sourceAsset, destAsset, weiAmount]);

  useEffect(() => {
    setLoading(true);
    getRate()
      .then(rate => {
        setData(rate);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [getRate, syncBlockNumber]);

  return { loading, rate: data };
}

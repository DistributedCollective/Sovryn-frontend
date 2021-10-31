import { useEffect, useMemo, useState } from 'react';
import { Asset } from 'types';
import { bignumber } from 'mathjs';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useCachedAssetPrice } from './trading/useCachedAssetPrice';
import { AssetsDictionary } from '../../utils/dictionaries/assets-dictionary';
import { useGetSaleInformation } from 'app/pages/OriginsLaunchpad/hooks/useGetSaleInformation';
import { useBondingCurvePrice } from './useBondingCurvePrice';
import {
  getTokenContractName,
  getTokenContract,
  getContract,
} from 'utils/blockchain/contract-helpers';

export const useEstimateMyntToSov = (weiAmount: string) => {
  const saleInfo = useGetSaleInformation();
  const bcp = useBondingCurvePrice(Asset.MYNT, weiAmount);
  const [totalSupply, setTotalSupply] = useState('0');

  useEffect(() => {
    contractReader
      .call<string>('MYNT_token', 'totalSupply', [])
      .then(result => {
        console.log('[totalSupply]', result);
        setTotalSupply(result);
      });
  }, []);

  useEffect(() => {
    contractReader
      .call<string>('SOV_token', 'balanceOf', [
        '0xd373969479fa3c530e12f175faff64711af4f1a6',
      ])
      .then(result => {
        console.log('[MYNT][balance]', result);
      });
  });

  return bignumber(weiAmount).div(saleInfo.depositRate).toString();

  // const asset = Asset.SOV;
  // const dollars = useCachedAssetPrice(asset, Asset.USDT);

  // const value = useMemo(() => {
  //   const { decimals } = AssetsDictionary.get(asset);
  //   return bignumber(weiAmount)
  //     .mul(dollars.value)
  //     .div(10 ** (decimals + 2))
  //     .toFixed(0);
  // }, [asset, dollars, weiAmount]);

  // return {
  //   value,
  //   loading: dollars.loading,
  //   error: dollars.error,
  // };
};

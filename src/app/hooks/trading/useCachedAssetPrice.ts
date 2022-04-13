import { useCallback, useEffect, useMemo, useState } from 'react';
import { Asset } from 'types/asset';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { fixNumber } from '../../../utils/helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { actions } from 'app/containers/WalletProvider/slice';

export function useCachedAssetPrice(sourceAsset: Asset, destAsset: Asset) {
  const { value: item, loading, error } = useCachedAssetRate(
    sourceAsset,
    destAsset,
  );
  return {
    value: item ? fixNumber(item.rate) : '0',
    error,
    loading,
  };
}

export const useCachedAssetRate = (sourceAsset: Asset, destAsset: Asset) => {
  const {
    assetRates: items,
    assetRatesLoading,
    assetRatesLoaded,
  } = useSelector(selectWalletProvider);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getRate = useCallback(async (sourceAsset: Asset, destAsset: Asset) => {
    if (sourceAsset === destAsset) {
      return {
        precision: '1',
        rate: '1',
      };
    }
    const rate = await contractReader.call(
      'sovrynProtocol',
      'getSwapExpectedReturn',
      [
        getTokenContract(sourceAsset).address,
        getTokenContract(destAsset).address,
        toWei('0.01'),
      ],
    );
    const price = typeof rate == 'string' ? parseInt(rate) * 100 : '0';
    return {
      precision: '1000000000000000000',
      rate: price.toString(),
    };
  }, []);

  const item = useMemo(
    () =>
      items.find(
        item => item.source === sourceAsset && item.target === destAsset,
      ),
    [destAsset, items, sourceAsset],
  );

  useEffect(() => {
    if (!item && assetRatesLoaded) {
      setLoading(true);
      getRate(sourceAsset, destAsset)
        .then(result =>
          dispatch(
            actions.setPrice({
              source: sourceAsset,
              target: destAsset,
              value: result,
            }),
          ),
        )
        .finally(() => setLoading(false));
    }
  }, [item, assetRatesLoaded, getRate, sourceAsset, destAsset, dispatch]);

  const value = useMemo(() => {
    if (sourceAsset === destAsset) {
      return { rate: '1', precision: '1' };
    }
    if (item) {
      return item.value;
    } else {
      return { rate: '0', precision: '0' };
    }
  }, [sourceAsset, destAsset, item]);

  return {
    value: value,
    error: null,
    loading: (assetRatesLoading && !assetRatesLoaded) || loading,
  };
};

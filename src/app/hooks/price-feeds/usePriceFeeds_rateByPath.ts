import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { CachedAssetRate } from '../../containers/WalletProvider/types';
import { actions } from 'app/containers/WalletProvider/slice';
import { toWei } from '../../../utils/blockchain/math-helpers';

export function usePriceFeeds_rateByPath() {
  const { syncBlockNumber, assetRates } = useSelector(selectWalletProvider);
  const dispatch = useDispatch();

  const getRate = useCallback(async (sourceAsset: Asset, destAsset: Asset) => {
    const rate = await contractReader.call(
      'sovrynProtocol',
      'getSwapExpectedReturn',
      [
        getTokenContract(sourceAsset).address,
        getTokenContract(destAsset).address,
        toWei(0.01),
      ],
    );
    const price = typeof rate == 'string' ? parseInt(rate) * 100 : '0';
    return {
      precision: '1000000000000000000',
      rate: price,
    };
  }, []);

  const getRates = useCallback(async () => {
    const assets = AssetsDictionary.list()
      .filter(item => item.asset !== 'BPRO')
      .map(item => item.asset);
    const items: CachedAssetRate[] = [];
    for (let i = 0; i < assets.length; i++) {
      const source = assets[i];
      for (let l = 0; l < assets.length; l++) {
        const target = assets[l];
        if (target === source) {
          continue;
        }
        const { precision, rate } = await getRate(source, target);
        items.push({
          source,
          target,
          value: {
            precision,
            rate: typeof rate === 'string' ? rate : String(rate),
          },
        });
      }
    }

    return items;
  }, [getRate]);

  useEffect(() => {
    getRates()
      .then(e => dispatch(actions.setPrices(JSON.parse(JSON.stringify(e)))))
      .catch(console.error);
  }, [dispatch, getRates, syncBlockNumber]);
  return assetRates;
}

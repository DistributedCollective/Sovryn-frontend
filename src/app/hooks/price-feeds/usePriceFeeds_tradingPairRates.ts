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
import { bignumber } from 'mathjs';

/**
 * use this only once
 */
export function usePriceFeeds_tradingPairRates() {
  const { syncBlockNumber, assetRates } = useSelector(selectWalletProvider);
  const dispatch = useDispatch();

  const getRate = useCallback(async (sourceAsset: Asset, destAsset: Asset) => {
    return await contractReader.call('priceFeed', 'queryRate', [
      getTokenContract(sourceAsset).address,
      getTokenContract(destAsset).address,
    ]);
  }, []);

  const getSwapRate = useCallback(
    async (sourceAsset: Asset, destAsset: Asset, amount: string = '1') => {
      const path = await contractReader.call('swapNetwork', 'conversionPath', [
        getTokenContract(sourceAsset).address,
        getTokenContract(destAsset).address,
      ]);
      return await contractReader.call('swapNetwork', 'rateByPath', [
        path,
        amount,
      ]);
    },
    [],
  );

  const getRates = useCallback(async () => {
    const assets = AssetsDictionary.list().map(item => item.asset);
    const items: CachedAssetRate[] = [];
    for (let i = 0; i < assets.length; i++) {
      const source = assets[i];
      for (let l = 0; l < assets.length; l++) {
        const target = assets[l];
        if (
          target === source ||
          target === Asset.CSOV || // todo: remove when oracle will have price
          source === Asset.CSOV ||
          target === Asset.SOV ||
          source === Asset.SOV ||
          target === Asset.ETH ||
          source === Asset.ETH
        ) {
          continue;
        }
        try {
          const result = await getRate(source, target);
          items.push({
            source,
            target,
            value: result as any,
          });
        } catch (e) {
          console.error(`Failed to retrieve rate of ${source} - ${target}`, e);
        }
      }
    }

    try {
      const btcToSov = await getSwapRate(Asset.RBTC, Asset.SOV, '1');

      items.push({
        source: Asset.RBTC,
        target: Asset.SOV,
        value: {
          precision: '1000000000000000000',
          rate: toWei(btcToSov),
        },
      });

      items.push({
        source: Asset.SOV,
        target: Asset.RBTC,
        value: {
          precision: '1000000000000000000',
          rate: toWei(1 / Number(btcToSov)),
        },
      });

      const btcToUsd = items.find(
        item => item.source === Asset.RBTC && item.target === Asset.USDT,
      )?.value?.rate;

      const sovToUsd = bignumber(btcToUsd)
        .mul(1 / Number(btcToSov))
        .toFixed(0);

      items.push({
        source: Asset.SOV,
        target: Asset.USDT,
        value: {
          precision: '1000000000000000000',
          rate: sovToUsd,
        },
      });

      items.push({
        source: Asset.CSOV,
        target: Asset.USDT,
        value: {
          precision: '1000000000000000000',
          rate: sovToUsd,
        },
      });
    } catch (e) {
      console.error('Failed to retrieve sov price', e);
    }

    // try {
    //   const btcToEth = await getSwapRate(Asset.RBTC, Asset.ETH, '1');
    //
    //   items.push({
    //     source: Asset.RBTC,
    //     target: Asset.ETH,
    //     value: {
    //       precision: '1000000000000000000',
    //       rate: toWei(btcToEth),
    //     },
    //   });
    //
    //   items.push({
    //     source: Asset.ETH,
    //     target: Asset.RBTC,
    //     value: {
    //       precision: '1000000000000000000',
    //       rate: toWei(1 / Number(btcToEth)),
    //     },
    //   });
    //
    //   const btcToUsd = items.find(
    //     item => item.source === Asset.RBTC && item.target === Asset.USDT,
    //   )?.value?.rate;
    //
    //   const ethToUsd = bignumber(btcToUsd)
    //     .mul(1 / Number(btcToEth))
    //     .toFixed(0);
    //
    //   items.push({
    //     source: Asset.ETH,
    //     target: Asset.USDT,
    //     value: {
    //       precision: '1000000000000000000',
    //       rate: ethToUsd,
    //     },
    //   });
    // } catch (e) {
    //   console.error('Failed to retrieve eth price', e);
    // }
    return items;
  }, [getRate, getSwapRate]);

  useEffect(() => {
    getRates()
      .then(e => dispatch(actions.setPrices(JSON.parse(JSON.stringify(e)))))
      .catch(console.error);
  }, [dispatch, getRates, syncBlockNumber]);

  return assetRates;
}

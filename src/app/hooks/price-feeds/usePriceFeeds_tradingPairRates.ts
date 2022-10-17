import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { CachedAssetRate } from '../../containers/WalletProvider/types';
import { actions } from 'app/containers/WalletProvider/slice';
import { toWei } from '../../../utils/blockchain/math-helpers';
import { useGetTokenRatesQuery } from 'utils/graphql/rsk/generated';
import { areAddressesEqual } from 'utils/helpers';
import { debug } from 'utils/debug';

const console = debug('usePriceFeeds_tradingPairRates');

const assetsWithoutOracle: Asset[] = [
  Asset.SOV,
  Asset.FISH,
  Asset.CSOV,
  Asset.ETH,
  Asset.MOC,
  Asset.XUSD,
  Asset.BNB,
  Asset.RIF,
  Asset.RDOC,
  Asset.MYNT,
  Asset.ZUSD,
];

const excludeAssets: Asset[] = [
  Asset.CSOV,
  Asset.RDOC,
  Asset.MYNT,
  Asset.ZUSD,
  Asset.USDT,
];

export const usePriceFeeds_tradingPairRates = () => {
  const dispatch = useDispatch();

  const { data, loading } = useGetTokenRatesQuery(); // note no polling here to reduce number of queries (realtime rates are unnecessary)

  const getRate = useCallback(
    (sourceAsset: Asset, destAsset: Asset) => {
      if (!loading && data?.tokens) {
        const { tokens } = data;

        const sourceToken = tokens.find(token =>
          areAddressesEqual(token.id, getTokenContract(sourceAsset).address),
        );

        const destinationToken = tokens.find(token =>
          areAddressesEqual(token.id, getTokenContract(destAsset).address),
        );

        if (!sourceToken?.lastPriceUsd || !destinationToken?.lastPriceUsd) {
          return 0;
        }

        return toWei(
          Number(sourceToken?.lastPriceUsd) /
            Number(destinationToken?.lastPriceUsd),
        );
      }
      return 0;
    },
    [data, loading],
  );

  const getRates = useCallback(() => {
    const assets = AssetsDictionary.list()
      .filter(item => !excludeAssets.includes(item.asset))
      .map(item => item.asset);
    const items: CachedAssetRate[] = [];
    for (let i = 0; i < assets.length; i++) {
      const source = assets[i];
      for (let l = 0; l < assets.length; l++) {
        const target = assets[l];
        if (
          target === source ||
          assetsWithoutOracle.includes(target) ||
          assetsWithoutOracle.includes(source)
        ) {
          continue;
        }
        try {
          const result = getRate(source, target);
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

    for (let asset of assetsWithoutOracle) {
      if (!AssetsDictionary.get(asset)?.hasAMM) {
        continue;
      }

      try {
        const token = data?.tokens.find(token =>
          areAddressesEqual(token.id, getTokenContract(asset).address),
        );

        items.push({
          source: Asset.RBTC,
          target: asset,
          value: {
            precision: '1000000000000000000',
            rate: token?.lastPriceBtc
              ? toWei(1 / Number(token?.lastPriceBtc))
              : '0',
          },
        });

        items.push({
          source: asset,
          target: Asset.RBTC,
          value: {
            precision: '1000000000000000000',
            rate: toWei(token?.lastPriceBtc),
          },
        });

        items.push({
          source: asset,
          target: Asset.USDT,
          value: {
            precision: '1000000000000000000',
            rate: toWei(token?.lastPriceUsd),
          },
        });
      } catch (e) {
        console.error(`Failed to retrieve ${asset} price`, e);
      }
    }

    return items;
  }, [data?.tokens, getRate]);

  useEffect(() => {
    dispatch(actions.getPrices());
    const rates = getRates();
    dispatch(actions.setPrices(JSON.parse(JSON.stringify(rates))));
  }, [dispatch, getRates]);
};

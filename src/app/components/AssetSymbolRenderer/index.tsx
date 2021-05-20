import React from 'react';
import { Asset } from '../../../types/asset';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import styles from './index.module.css';

const symbolMap = {
  [Asset.RBTC]: (
    <>
      <em>R</em>BTC
    </>
  ),
  [Asset.USDT]: (
    <>
      <em>R</em>USDT
    </>
  ),
};

export function getAssetSymbol(asset: Asset) {
  if (symbolMap.hasOwnProperty(asset)) {
    return symbolMap[asset];
  }
  return AssetsDictionary.get(asset).symbol;
}

interface IAssetSymbolRenderer {
  asset: Asset;
}

export const AssetSymbolRenderer: React.FC<IAssetSymbolRenderer> = ({
  asset,
}) => <span className={styles.symbol}>{getAssetSymbol(asset)}</span>;

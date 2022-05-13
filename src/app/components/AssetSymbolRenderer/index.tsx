import classNames from 'classnames';
import React from 'react';
import { Asset } from '../../../types';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import styles from './index.module.scss';

const symbolMap = {
  [Asset.WRBTC]: (
    <>
      <em>WR</em>BTC
    </>
  ),
  [Asset.BTCS]: (
    <>
      BTC<em>S</em>
    </>
  ),
  [Asset.USDT]: (
    <>
      <em>R</em>USDT
    </>
  ),
  [Asset.ETH]: (
    <>
      ETH<em>S</em>
    </>
  ),
  [Asset.BNB]: (
    <>
      BNB<em>S</em>
    </>
  ),
  [Asset.RDOC]: (
    <>
      <em>R</em>DOC
    </>
  ),
  [Asset.WRBTC]: (
    <>
      <em>W</em>RBTC
    </>
  ),
};

export function getAssetSymbol(asset: Asset) {
  if (symbolMap.hasOwnProperty(asset)) {
    return symbolMap[asset];
  }
  return AssetsDictionary.get(asset)?.symbol || asset;
}

interface IAssetSymbolRenderer {
  asset?: Asset;
  assetString?: string;
  assetClassName?: string;
}

export const AssetSymbolRenderer: React.FC<IAssetSymbolRenderer> = ({
  asset,
  assetString,
  assetClassName,
}) => (
  <span className={classNames(styles.symbol, assetClassName)}>
    {asset ? getAssetSymbol(asset) : assetString}
  </span>
);

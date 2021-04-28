/**
 *
 * AssetRenderer
 *
 */
import React from 'react';

import { Asset } from 'types/asset';

import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import styles from './index.module.css';

interface CurrencyProps {
  asset: Asset;
  showImage?: boolean;
}
const symbolMap = {
  [Asset.RBTC]: (
    <>
      <small className={styles.symbol}>R</small>BTC
    </>
  ),
  [Asset.USDT]: (
    <>
      <small className={styles.symbol}>R</small>USDT
    </>
  ),
};

function getAssetSymbol(asset: Asset) {
  if (symbolMap.hasOwnProperty(asset)) {
    return <span>{symbolMap[asset]}</span>;
  }
  return AssetsDictionary.get(asset).symbol;
}
export function AssetRenderer(props: CurrencyProps) {
  return (
    <>
      {props.showImage && (
        <img
          className="tw-inline tw-mr-3 tw-h-8 tw-w-8 tw-object-contain"
          src={AssetsDictionary.get(props.asset).logoSvg}
          alt={AssetsDictionary.get(props.asset).name}
        />
      )}
      {getAssetSymbol(props.asset)}
    </>
  );
}

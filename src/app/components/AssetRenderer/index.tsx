/**
 *
 * AssetRenderer
 *
 */
import React, { useMemo } from 'react';
import cn from 'classnames';

import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

import styles from './index.module.css';

type ImageSizes = 4 | 5 | 6 | 8 | 12;

interface CurrencyProps {
  asset: Asset;
  showImage?: boolean;
  imageSize?: ImageSizes;
}

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
    return <span className={styles.symbol}>{symbolMap[asset]}</span>;
  }
  return AssetsDictionary.get(asset).symbol;
}

export function AssetRenderer(props: CurrencyProps) {
  const classNames = useMemo(() => getSizeClass(props.imageSize), [
    props.imageSize,
  ]);

  return (
    <span className="tw-inline-flex tw-flex-row tw-justify-start tw-items-center tw-shrink-0 tw-grow-0 tw-space-x-2">
      {props.showImage && (
        <img
          className={cn('tw-object-contain', classNames)}
          src={AssetsDictionary.get(props.asset).logoSvg}
          alt={AssetsDictionary.get(props.asset).name}
        />
      )}
      <span>{getAssetSymbol(props.asset)}</span>
    </span>
  );
}

AssetRenderer.defaultProps = {
  imageSize: 8,
};

// Full class names are required to be here so css purger would not remove "unused" classes.
const sizeClassMap = {
  4: 'tw-h-4 tw-w-5',
  5: 'tw-h-5 tw-w-5',
  6: 'tw-h-6 tw-w-6',
  8: 'tw-h-8 tw-w-8',
  12: 'tw-h-12 tw-w-12',
};

function getSizeClass(size: number | undefined) {
  if (size !== undefined && sizeClassMap.hasOwnProperty(size)) {
    return sizeClassMap[size];
  }
  return 'tw-h-8 tw-w-8';
}

/**
 *
 * TradingTokenContainer
 *
 */

import React from 'react';
import { DrizzleProvider } from '../DrizzleProvider';
import { AssetsDictionary } from 'utils/blockchain/assets-dictionary';
import { createDrizzleAssets } from 'utils/blockchain/createDrizzle';
import { TradingToken } from 'app/components/TradingToken';
import { Asset } from 'types/asset';

interface Props {
  asset: Asset;
}

export function TradingTokenContainer(props: Props) {
  const assets = AssetsDictionary.assetList();
  const drizzle = createDrizzleAssets(assets);
  return (
    <DrizzleProvider drizzle={drizzle}>
      <TradingToken asset={props.asset} />
    </DrizzleProvider>
  );
}

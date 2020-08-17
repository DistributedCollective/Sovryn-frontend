/**
 *
 * TradingTokenContainer
 *
 */

import React, { useRef } from 'react';
import { DrizzleProvider } from '../DrizzleProvider';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { createDrizzleAssets } from '../../../utils/blockchain/createDrizzle';
import { TradingToken } from '../../components/TradingToken';
import { Asset } from '../../../types/asset';

interface Props {
  asset: Asset;
}

export function TradingTokenContainer(props: Props) {
  const assets = AssetsDictionary.assetList();
  const drizzle = useRef(createDrizzleAssets(assets));
  return (
    <DrizzleProvider
      drizzle={drizzle.current}
      drizzleError={<RenderLoader />}
      drizzleLoadingContractsAndAccounts={<RenderLoader />}
      drizzleLoadingWeb3={<RenderLoader />}
    >
      <TradingToken asset={props.asset} />
    </DrizzleProvider>
  );
}

function RenderLoader() {
  return <div className="w-100 h-100 bp3-skeleton" />;
}

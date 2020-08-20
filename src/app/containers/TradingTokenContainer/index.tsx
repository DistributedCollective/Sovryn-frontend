/**
 *
 * TradingTokenContainer
 *
 */

import React from 'react';
import { TradingToken } from 'app/components/TradingToken';
import { Asset } from 'types/asset';

interface Props {
  asset: Asset;
}

export function TradingTokenContainer(props: Props) {
  return <TradingToken asset={props.asset} />;
}

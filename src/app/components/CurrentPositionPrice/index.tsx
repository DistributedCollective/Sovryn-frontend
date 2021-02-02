/**
 *
 * TradeButton
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { numberToUSD } from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';

interface Props {
  source: Asset;
  destination: Asset;
  amount: string;
  isLong: boolean;
}

export function CurrentPositionPrice(props: Props) {
  const { loading, price } = useCurrentPositionPrice(
    props.destination,
    props.source,
    props.amount,
    props.isLong,
  );
  return (
    <LoadableValue loading={loading} value={<>{numberToUSD(price, 2)}</>} />
  );
}

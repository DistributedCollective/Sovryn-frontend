/**
 *
 * TradeButton
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';
import { bignumber } from 'mathjs';

interface Props {
  source: Asset;
  destination: Asset;
  amount: string;
  startPrice: number;
  isLong: boolean;
}

export function CurrentPositionProfit(props: Props) {
  const { loading, price } = useCurrentPositionPrice(
    props.destination,
    props.source,
    props.amount,
    props.isLong,
  );
  let profit = '0';

  let diff = 1;
  if (props.isLong) {
    diff = (price - props.startPrice) / price;
    // profit = (price - props.startPrice) * positionSize;
    profit = bignumber(props.amount).mul(diff).toFixed(0);
  } else {
    diff = (props.startPrice - price) / props.startPrice;
    profit = bignumber(props.amount).mul(diff).toFixed(0);
  }

  function Change() {
    if (diff > 0) {
      return (
        <>
          Up by{' '}
          <span className="text-green">{toNumberFormat(diff * 100, 2)}</span>%
        </>
      );
    }
    if (diff < 0) {
      return (
        <>
          Down by{' '}
          <span className="text-red">
            {toNumberFormat(Math.abs(diff * 100), 2)}
          </span>
          %
        </>
      );
    }
    return <>No change</>;
  }
  return (
    <>
      <LoadableValue
        loading={loading}
        value={
          <>
            <span className={diff < 0 ? 'text-red' : 'text-green'}>
              {weiToNumberFormat(profit, 8)}
            </span>{' '}
            {props.destination}
          </>
        }
        tooltip={
          <>
            <Change />
          </>
        }
      />
    </>
  );
}

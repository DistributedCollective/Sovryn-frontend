/**
 *
 * TradeButton
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { formatAsBTCPrice, numberToUSD } from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';

interface Props {
  source: Asset;
  destination: Asset;
  amount: string;
  startRate: string;
  isLong: boolean;
}

export function CurrentPositionProfit(props: Props) {
  const { loading, price } = useCurrentPositionPrice(
    props.destination,
    props.source,
    props.amount,
    props.isLong,
  );
  const startPrice = formatAsBTCPrice(props.startRate, props.isLong);
  const positionSize = parseFloat(weiTo18(props.amount));
  let profit = 0;

  if (props.isLong) {
    profit = (price - startPrice) * positionSize;
  } else {
    profit = (startPrice - price) / positionSize;
  }

  // const positionSize: number = parseFloat(weiTo18(collateralStr));
  // const startPrice: number = parseFloat(weiTo18(startRateStr));
  // const currentPriceUSD: number = 1 / currentPriceBTC;
  //
  // const profitLong = positionSize * currentPriceBTC - positionSize * startPrice;
  // const profitShort =
  //   (positionSize * currentPriceUSD - positionSize * startPrice) *
  //   currentPriceBTC;

  // const profit = calculateProfit(
  //   props.amount,
  //   props.startRate,
  //   price,
  //   props.isLong,
  // );
  return (
    <LoadableValue
      loading={loading}
      value={
        <span className={profit < 0 ? 'text-red' : 'text-green'}>
          {numberToUSD(profit, 4)}
        </span>
      }
    />
  );
}

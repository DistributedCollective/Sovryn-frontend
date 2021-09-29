import React, { useMemo } from 'react';
import { TradingPosition } from '../../../types/trading-position';
import { Asset } from '../../../types';
import { useGetEstimatedMarginDetails } from '../../hooks/trading/useGetEstimatedMarginDetails';
import { useCurrentPositionPrice } from '../../hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../../components/LoadableValue';
import { toNumberFormat } from '../../../utils/display-text/format';

interface Props {
  position: TradingPosition;
  leverage: number;
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
  weiAmount: string;
}

export function PricePrediction({
  loanToken,
  collateralToken,
  useLoanTokens,
  weiAmount,
  leverage,
  ...props
}: Props) {
  const collateralAmount = useMemo(() => (useLoanTokens ? '0' : weiAmount), [
    useLoanTokens,
    weiAmount,
  ]);
  const loanTokenAmount = useMemo(() => (useLoanTokens ? weiAmount : '0'), [
    useLoanTokens,
    weiAmount,
  ]);

  const { value } = useGetEstimatedMarginDetails(
    loanToken,
    leverage,
    loanTokenAmount,
    collateralAmount,
    collateralToken,
  );

  const { price, loading } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    value.principal,
    props.position === TradingPosition.SHORT,
  );

  return (
    <LoadableValue loading={loading} value={<>{toNumberFormat(price, 6)}</>} />
  );
}

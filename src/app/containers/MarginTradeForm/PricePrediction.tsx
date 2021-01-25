import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { useTrading_resolvePairTokens } from '../../hooks/trading/useTrading_resolvePairTokens';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';
import { Asset } from '../../../types/asset';

interface Props {
  position: TradingPosition;
  leverage: number;
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
  weiAmount: string;
  interest: string;
}

export function PricePrediction({
  useLoanTokens,
  weiAmount,
  leverage,
  ...props
}: Props) {
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [loanTokenAmount, setLoanTokenAmount] = useState('0');

  useEffect(() => {
    setLoanTokenAmount(useLoanTokens ? weiAmount : '0');
    setCollateralAmount(useLoanTokens ? '0' : weiAmount);
  }, [useLoanTokens, weiAmount, leverage]);

  // The loan size is computed depending on the leverage and the interest rate:
  // loan size = passed leverage * collateral converted to loan tokens + interest
  const [loanSize, setLoanSize] = useState('0');
  useEffect(() => {
    let _loanSize = bignumber(leverage)
      .mul(loanTokenAmount)
      .add(bignumber(loanTokenAmount).mul(bignumber(props.interest).mul(100)));
    // 0.15% trading fees are subtracted from the loan, before it is swapped
    _loanSize.sub(_loanSize.mul(100 * 0.15));
    setLoanSize(_loanSize.toFixed(0));
  }, [props.interest, props.leverage, props.loanTokens]);

  // The protocol subtracts the interest. The resulting position size is passed leverage * collateral converted to loan tokens
  const [positionSize, setPositionSize] = useState('0');
  useEffect(() => {
    setPositionSize(bignumber(props.leverage).mul(props.loanTokens).toFixed(0));
  }, [props.leverage, props.loanTokens]);

  // The actual swap: If the user opens the position with underlying loan tokens,
  // the complete position size is swapped. If he enters the position with
  // collateral tokens, only the loan is swapped.
  useEffect(() => {
    if (useLoanTokens) {
      console.log('used loan token');
    } else {
      console.log('used collateral');
    }
  }, [useLoanTokens]);

  console.log(loanSize, positionSize);

  return <div>{123}</div>;
}

import { usePriceFeeds_QueryRate } from '../price-feeds/useQueryRate';
import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { useLending_nextBorrowInterestRate } from './useLending_nextBorrowInterestRate';
import { Asset } from '../../../types/asset';

export function useBorrowInterestRate(
  asset: Asset,
  collateral: Asset,
  leverage: number,
  weiAmount: string,
) {
  const { value: result } = usePriceFeeds_QueryRate(collateral, asset);

  const [totalDeposit, setTotalDeposit] = useState('0');
  const [borrowAmount, setBorrowAmount] = useState(totalDeposit);

  // Calculate loan tokens we depositing.
  useEffect(() => {
    let _totalDeposit = '0'; // loanTo
    // let totalDeposit = props.loanTokenSent;

    if (weiAmount !== '0') {
      // props.collateralTokenSent != '0'
      if (result.rate !== '0') {
        _totalDeposit = bignumber(weiAmount)
          .mul(result.rate)
          .div(result.precision)
          .add(_totalDeposit)
          .toFixed(0);
      }
    }
    setTotalDeposit(_totalDeposit);
    // eslint-disable-next-line
  }, [JSON.stringify(result), weiAmount]);

  useEffect(() => {
    setBorrowAmount(
      bignumber(totalDeposit)
        .mul(leverage - 1)
        .toFixed(0),
    );
  }, [totalDeposit, leverage]);

  const { value, loading } = useLending_nextBorrowInterestRate(
    asset,
    borrowAmount,
  );

  return { value, loading };
}

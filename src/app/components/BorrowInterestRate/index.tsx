/**
 *
 * BorrowInterestRate
 *
 */
import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowInterestRate } from 'app/hooks/trading/useBorrowInterestRate';
import { usePriceFeeds_QueryRate } from 'app/hooks/price-feeds/useQueryRate';
import { LoadableValue } from '../LoadableValue';
import { FieldGroup } from '../FieldGroup';
import { DummyField } from '../DummyField';

interface Props {
  asset: Asset;
  collateral: Asset;
  leverage: number;
  weiAmount: string;
  labelColor: string;
}

export function BorrowInterestRate(props: Props) {
  const { value: result } = usePriceFeeds_QueryRate(
    props.collateral,
    props.asset,
  );

  const [totalDeposit, setTotalDeposit] = useState('0');
  const [borrowAmount, setBorrowAmount] = useState(totalDeposit);

  // Calculate loan tokens we depositing.
  useEffect(() => {
    let _totalDeposit = '0'; // loanTo
    // let totalDeposit = props.loanTokenSent;

    if (props.weiAmount !== '0') {
      // props.collateralTokenSent != '0'
      if (result.rate !== '0') {
        _totalDeposit = bignumber(props.weiAmount)
          .mul(result.rate)
          .div(result.precision)
          .add(_totalDeposit)
          .toFixed(0);
      }
    }
    setTotalDeposit(_totalDeposit);
    // eslint-disable-next-line
  }, [JSON.stringify(result), props]);

  useEffect(() => {
    setBorrowAmount(
      bignumber(totalDeposit)
        .mul(props.leverage - 1)
        .toFixed(0),
    );
  }, [totalDeposit, props.leverage]);

  const { value, loading } = useBorrowInterestRate(props.asset, borrowAmount);

  return (
    <FieldGroup label="Interest APR" labelColor={props.labelColor}>
      <DummyField>
        <LoadableValue
          value={
            <>
              {weiToFixed(value, 2)} <span className="text-muted">%</span>
            </>
          }
          loading={loading}
        />
      </DummyField>
    </FieldGroup>
  );
}

BorrowInterestRate.defaultProps = {
  labelColor: 'var(--dark-gray)',
};

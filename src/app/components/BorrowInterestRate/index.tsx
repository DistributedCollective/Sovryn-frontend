/**
 *
 * BorrowInterestRate
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { useBorrowInterestRate } from 'app/hooks/trading/useBorrowInterestRate';
import { LoadableValue } from '../LoadableValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';

interface Props {
  asset: Asset;
  leverage: number;
  weiAmount: string;
}

export function BorrowInterestRate(props: Props) {
  const { value, loading } = useBorrowInterestRate(
    props.asset,
    bignumber(props.weiAmount)
      .mul(props.leverage - 1)
      .toString(),
  );

  return (
    <div>
      <div className="text-MediumGrey data-label">Interest APR</div>
      <div className="data-container">
        <LoadableValue
          value={<>{weiToFixed(value, 2)} %</>}
          loading={loading}
        />
      </div>
    </div>
  );
}

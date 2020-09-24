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

interface Props {
  asset: Asset;
  weiAmount: string;
}

export function BorrowInterestRate(props: Props) {
  const { value, loading } = useBorrowInterestRate(
    props.asset,
    props.weiAmount,
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

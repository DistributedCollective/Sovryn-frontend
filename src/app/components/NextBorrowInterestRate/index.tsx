/**
 *
 * NextBorrowInterestRate
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';

import { Asset } from 'types/asset';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useLending_nextBorrowInterestRate } from 'app/hooks/trading/useLending_nextBorrowInterestRate';

interface Props {
  asset: Asset;
  weiAmount: string;
}

export function NextBorrowInterestRate(props: Props) {
  const { value } = useLending_nextBorrowInterestRate(
    props.asset,
    props.weiAmount,
  );
  return (
    <Tooltip content={<>{weiToFixed(value, 18)}%</>}>
      <h2 className="d-flex flex-row">
        {weiToFixed(value, 2)}
        <span className="text-muted">%</span>
      </h2>
    </Tooltip>
  );
}

/**
 *
 * NextBorrowInterestRate
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';

import { Asset } from 'types/asset';
import { useLending_nextSupplyInterestRate } from 'app/hooks/lending/useLending_nextSupplyInterestRate';
import { weiToFixed } from 'utils/blockchain/math-helpers';

interface Props {
  asset: Asset;
  weiAmount: string;
}

export function NextSupplyInterestRate(props: Props) {
  const { value } = useLending_nextSupplyInterestRate(
    props.asset,
    props.weiAmount,
  );
  return (
    <Tooltip content={<>{weiToFixed(value, 18)}%</>}>
      <div className="tw-flex tw-flex-row tw-text-lg">
        {weiToFixed(value, 2)}
        <span className="tw-text-muted">%</span>
      </div>
    </Tooltip>
  );
}

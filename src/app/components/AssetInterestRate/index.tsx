/**
 *
 * AssetInterestRate
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';

import { Asset } from 'types/asset';
import { useLendingInterestRate } from 'app/hooks/lending/useLendingInterestRate';
import { weiToFixed } from 'utils/blockchain/math-helpers';

interface Props {
  asset: Asset;
  weiAmount: string;
}

export function AssetInterestRate(props: Props) {
  const { value } = useLendingInterestRate(props.asset, props.weiAmount);
  return (
    <Tooltip content={<>{weiToFixed(value, 18)}%</>}>
      <h2 className="d-flex flex-row">
        {weiToFixed(value, 4)}
        <span className="text-lightGrey">%</span>
      </h2>
    </Tooltip>
  );
}

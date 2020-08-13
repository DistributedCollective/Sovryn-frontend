/**
 *
 * AssetInterestRate
 *
 */
import React from 'react';
import { Tag, Tooltip } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { useLendingInterestRate } from 'hooks/lending/useLendingInterestRate';
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
        <Tag minimal className="ml-2">
          %
        </Tag>
      </h2>
    </Tooltip>
  );
}

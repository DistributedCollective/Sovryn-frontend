import React from 'react';

import { Asset } from 'types/asset';
import { weiTo4 } from 'utils/blockchain/math-helpers';

interface Props {
  amount: string;
  asset: Asset;
}

export function CollateralAmount({ amount, asset }: Props) {
  const loading = false;
  return (
    <span className={`${loading && 'bp3-skeleton'}`}>
      {weiTo4(amount)} <span className="tw-text-gray-6">{asset}</span>{' '}
    </span>
  );
}

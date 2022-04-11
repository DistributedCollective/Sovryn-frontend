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
import classNames from 'classnames';

interface Props {
  asset: Asset;
  weiAmount: string;
  className?: string;
}

export function NextSupplyInterestRate(props: Props) {
  const { value } = useLending_nextSupplyInterestRate(
    props.asset,
    props.weiAmount,
  );
  return (
    <Tooltip content={<>{weiToFixed(value, 18)}%</>}>
      <h2 className={classNames('tw-flex tw-flex-row', props.className)}>
        {weiToFixed(value, 2)}%
      </h2>
    </Tooltip>
  );
}

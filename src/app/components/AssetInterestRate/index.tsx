/**
 *
 * AssetInterestRate
 *
 */
import React, { useEffect, useState } from 'react';
import { Tooltip } from '@blueprintjs/core';
import { fromWei } from 'web3-utils';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { useCacheCall } from 'hooks/useCacheCall';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';

interface Props {
  asset: Asset;
}

export function AssetInterestRate(props: Props) {
  const interestWei = useCacheCall(
    getLendingContractName(props.asset),
    'nextSupplyInterestRate',
    1000, // todo: why 1000?
  );

  const [interestRate, setInterestRate] = useState(bignumber(0));

  useEffect(() => {
    if (interestWei !== undefined) {
      setInterestRate(bignumber(fromWei(interestWei)));
    }
  }, [interestWei]);

  return (
    <Tooltip content={<>{interestRate.toFixed(18)}%</>}>
      <h2 className="d-flex flex-row">
        {interestRate.toFixed(4)}
        <span className="text-lightGrey">%</span>
      </h2>
    </Tooltip>
  );
}

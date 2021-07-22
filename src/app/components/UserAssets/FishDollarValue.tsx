import React from 'react';

import { LoadableValue } from '../LoadableValue';
import { numberToUSD } from '../../../utils/display-text/format';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { useGetFishDollarValue } from 'app/pages/OriginsLaunchpad/hooks/useGetFishDollarValue';

interface Props {
  tokens: string;
}

export function FishDollarValue({ tokens }: Props) {
  const fishDollarValue = useGetFishDollarValue(Number(tokens));
  return (
    <LoadableValue
      value={numberToUSD(Number(weiToFixed(fishDollarValue.value, 4)), 4)}
      loading={fishDollarValue.loading}
    />
  );
}

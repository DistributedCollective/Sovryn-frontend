import React from 'react';

import { LoadableValue } from '../LoadableValue';
import { numberToUSD } from '../../../utils/display-text/format';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { useGetFishDollarValue } from 'app/pages/OriginsLaunchpad/hooks/useGetFishDollarValue';

interface Props {
  tokens: string;
}

/**
 * @deprecated
 * @param tokens
 * @constructor
 */
export function FishDollarValue({ tokens }: Props) {
  const { value, loading } = useGetFishDollarValue(Number(tokens));
  return (
    <LoadableValue
      value={numberToUSD(Number(weiTo4(value)), 4)}
      loading={loading}
    />
  );
}

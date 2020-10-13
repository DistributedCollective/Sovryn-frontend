/**
 *
 * StatsRowData
 *
 */
import React from 'react';
import { weiTo18, weiTo4 } from '../../../utils/blockchain/math-helpers';
import { LoadableValue } from '../LoadableValue';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { ContractName } from '../../../utils/types/contracts';

interface Props {
  contract: ContractName;
  data: string;
  displayType: string;
}

export function StatsRowData(props: Props) {
  const { value, loading } = useCacheCallWithValue(
    props.contract,
    props.data,
    '0',
  );

  return (
    <>
      {props.displayType === 'normal' ? (
        <LoadableValue
          value={`${parseFloat(weiTo18(value)).toLocaleString('en', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })} `}
          loading={loading}
        />
      ) : (
        <LoadableValue value={`${weiTo4(value)}`} loading={loading} />
      )}
    </>
  );
}

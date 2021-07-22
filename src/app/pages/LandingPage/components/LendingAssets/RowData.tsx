/**
 *
 * StatsRowData
 *
 */
import React from 'react';
import { weiTo18, weiTo4 } from 'utils/blockchain/math-helpers';
import { ContractName } from 'utils/types/contracts';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { LoadableValue } from 'app/components/LoadableValue';

interface Props {
  contract: ContractName;
  data: string;
  displayType: string;
  prepend?: string;
}

export function RowData(props: Props) {
  const { value, loading } = useCacheCallWithValue(
    props.contract,
    props.data,
    '0',
  );

  function MaybePrepend() {
    if (props.prepend) {
      return (
        <>
          {' '}
          <span className="tw-text-white">{props.prepend}</span>
        </>
      );
    }
    return <></>;
  }

  return (
    <>
      {props.displayType === 'normal' ? (
        <>
          <LoadableValue
            value={
              <>
                {parseFloat(weiTo18(value)).toLocaleString('en', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                <MaybePrepend />
              </>
            }
            loading={loading}
          />
        </>
      ) : (
        <LoadableValue
          value={
            <>
              {weiTo4(value)}
              <MaybePrepend />
            </>
          }
          loading={loading}
        />
      )}
    </>
  );
}

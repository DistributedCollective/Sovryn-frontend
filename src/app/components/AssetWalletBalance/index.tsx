/**
 *
 * AssetWalletBalance
 *
 */
import React, { useEffect } from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { LoadableValue } from '../LoadableValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useTokenBalanceOf } from 'app/hooks/useTokenBalanceOf';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function AssetWalletBalance(props: Props) {
  const { value, loading } = useTokenBalanceOf(props.asset);

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
  }, [props, value]);

  return (
    <div className="mb-2">
      <div className="d-inline text-lightGrey">Balance</div>
      <div className="d-inline float-right">
        <LoadableValue
          value={
            <Tooltip content={<>{weiToFixed(value, 18)} %</>}>
              <>
                {weiToFixed(value, 4)}{' '}
                <span className="text-lightGrey">{props.asset}</span>
              </>
            </Tooltip>
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

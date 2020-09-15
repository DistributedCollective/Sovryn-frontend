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
import { useIsConnected } from 'app/hooks/useAccount';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function AssetWalletBalance(props: Props) {
  const { value, loading } = useTokenBalanceOf(props.asset);
  const connected = useIsConnected();

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
            connected ? (
              <Tooltip content={<>{weiToFixed(value, 18)} %</>}>
                <>
                  {weiToFixed(value, 2)}{' '}
                  <span className="text-lightGrey">{props.asset}</span>
                </>
              </Tooltip>
            ) : (
              <span>Connect to wallet</span>
            )
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

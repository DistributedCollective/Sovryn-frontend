/**
 *
 * AssetWalletBalance
 *
 */
import React, { useEffect } from 'react';
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
    <>
      <div className="mt-1 data-label text-MediumGrey">Account Balance</div>
      <div className="m-0">
        <LoadableValue
          value={
            connected ? (
              <>
                <span className="data-label text-MediumGrey">
                  {props.asset}
                </span>{' '}
                {weiToFixed(value, 4)}
              </>
            ) : (
              <span className="data-label text-MediumGrey">
                Connect to wallet
              </span>
            )
          }
          loading={loading}
        />
      </div>
    </>
  );
}

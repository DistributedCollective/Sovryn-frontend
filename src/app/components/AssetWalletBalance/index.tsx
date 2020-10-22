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
    <div>
      <div className="font-weight-bold text-muted mb-2">Account Balance</div>
      {!connected && <span>Connect to wallet</span>}
      {connected && (
        <div className="d-flex flex-row justify-content-start align-items-center">
          <span className="text-muted">{props.asset}</span>
          <span className="text-white font-weight-bold ml-2">
            <LoadableValue value={weiToFixed(value, 4)} loading={loading} />
          </span>
        </div>
      )}
    </div>
  );
}

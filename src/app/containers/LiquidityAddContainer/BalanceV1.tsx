/**
 *
 * AssetWalletBalance
 *
 */
import React, { useEffect } from 'react';
import { Asset } from 'types/asset';
import { LoadableValue } from '../../components/LoadableValue';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { weiTo18, weiToFixed } from '../../../utils/blockchain/math-helpers';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function BalanceV1(props: Props) {
  const { value, loading } = useAssetBalanceOf(props.asset);

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.asset, value]);

  return (
    <LoadableValue
      value={weiToFixed(value, 4)}
      loading={loading}
      tooltip={<>{weiTo18(value)}</>}
    />
  );
}

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

export function BalanceV1({ asset, onBalance }: Props) {
  const { value, loading } = useAssetBalanceOf(asset);

  useEffect(() => onBalance?.(value), [value, onBalance]);

  return (
    <LoadableValue
      value={weiToFixed(value, 4)}
      loading={loading}
      tooltip={<>{weiTo18(value)}</>}
    />
  );
}

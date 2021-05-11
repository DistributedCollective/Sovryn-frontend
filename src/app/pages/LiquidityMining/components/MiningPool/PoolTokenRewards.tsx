import React, { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Asset } from '../../../../../types';

interface Props {
  pool: LiquidityPool;
}

export function PoolTokenRewards({ pool }: Props) {
  return (
    <>
      {pool.version === 1 && <PoolTokenRewardsV1 pool={pool} />}
      {pool.version === 2 && <PoolTokenRewardsV2 pool={pool} />}
    </>
  );
}

function PoolTokenRewardsV1({ pool }: Props) {
  const { value, loading } = useLiquidityMining_getUserAccumulatedReward(
    pool.supplyAssets[0].getContractAddress(),
  );
  return (
    <LoadableValue
      loading={loading}
      value={
        <>
          {weiToNumberFormat(value, 3)} <AssetRenderer asset={Asset.SOV} />
        </>
      }
    />
  );
}

function PoolTokenRewardsV2({ pool }: Props) {
  const {
    value: token1,
    loading: loading1,
  } = useLiquidityMining_getUserAccumulatedReward(
    pool.supplyAssets[0].getContractAddress(),
  );
  const {
    value: token2,
    loading: loading2,
  } = useLiquidityMining_getUserAccumulatedReward(
    pool.supplyAssets[1].getContractAddress(),
  );

  const loading = useMemo(() => loading1 || loading2, [loading1, loading2]);
  const value = useMemo(() => bignumber(token1).add(token2).toString(), [
    token1,
    token2,
  ]);

  return (
    <LoadableValue
      loading={loading}
      value={
        <>
          {weiToNumberFormat(value, 3)} <AssetRenderer asset={Asset.SOV} />
        </>
      }
    />
  );
}

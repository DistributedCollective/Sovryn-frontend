import React from 'react';
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
          {weiToNumberFormat(value, 4)} <AssetRenderer asset={Asset.SOV} />
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

  return (
    <>
      <LoadableValue
        loading={loading1}
        value={
          <>
            {weiToNumberFormat(token1, 4)} <AssetRenderer asset={Asset.SOV} />
          </>
        }
      />
      <LoadableValue
        loading={loading2}
        value={
          <>
            {weiToNumberFormat(token2, 4)} <AssetRenderer asset={Asset.SOV} />
          </>
        }
      />
    </>
  );
}

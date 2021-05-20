import React from 'react';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { Asset } from '../../../../../types';
import { ProfitLossRenderer } from 'app/components/FinanceV2Components/RowTable/ProfitLossRenderer';

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
        <ProfitLossRenderer
          isProfit={true}
          amount={weiToNumberFormat(value, 3)}
          asset={Asset.SOV}
        />
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
          <ProfitLossRenderer
            isProfit={true}
            amount={weiToNumberFormat(token1, 4)}
            asset={Asset.SOV}
          />
        }
      />
      <LoadableValue
        loading={loading2}
        value={
          <ProfitLossRenderer
            isProfit={true}
            amount={weiToNumberFormat(token2, 4)}
            asset={Asset.SOV}
          />
        }
      />
    </>
  );
}

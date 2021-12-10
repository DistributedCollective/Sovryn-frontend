import React from 'react';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { Asset } from '../../../../../types';
import { ProfitLossRenderer } from 'app/components/FinanceV2Components/RowTable/ProfitLossRenderer';
import { useLiquidityMining_getTotalUserAccumulatedReward } from '../../hooks/useLiquidityMining_getTotalUserAccumulatedReward';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface IPoolTokenRewardsProps {
  pool: AmmLiquidityPool;
}

export const PoolTokenRewards: React.FC<IPoolTokenRewardsProps> = ({
  pool,
}) => {
  return (
    <>
      {pool.converterVersion === 1 && <PoolTokenRewardsV1 pool={pool} />}
      {pool.converterVersion === 2 && <PoolTokenRewardsV2 pool={pool} />}
    </>
  );
};

const PoolTokenRewardsV1: React.FC<IPoolTokenRewardsProps> = ({ pool }) => {
  const { value, loading } = useLiquidityMining_getTotalUserAccumulatedReward(
    pool.poolTokenA,
  );
  return (
    <LoadableValue
      loading={loading}
      value={
        <ProfitLossRenderer
          isProfit={true}
          amount={weiToNumberFormat(value, 6)}
          asset={Asset.SOV}
        />
      }
    />
  );
};

const PoolTokenRewardsV2: React.FC<IPoolTokenRewardsProps> = ({ pool }) => {
  const {
    value: token1,
    loading: loading1,
  } = useLiquidityMining_getTotalUserAccumulatedReward(pool.poolTokenA);
  const {
    value: token2,
    loading: loading2,
  } = useLiquidityMining_getTotalUserAccumulatedReward(
    pool.poolTokenB as string,
  );

  return (
    <>
      <LoadableValue
        loading={loading1}
        value={
          <ProfitLossRenderer
            isProfit={true}
            amount={weiToNumberFormat(token1, 6)}
            asset={Asset.SOV}
          />
        }
      />
      <LoadableValue
        loading={loading2}
        value={
          <ProfitLossRenderer
            isProfit={true}
            amount={weiToNumberFormat(token2, 6)}
            asset={Asset.SOV}
          />
        }
      />
    </>
  );
};

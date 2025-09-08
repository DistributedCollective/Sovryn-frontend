import { useMemo } from 'react';
import { currentChainId } from 'utils/classifiers';

import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { BlockedPoolConfig } from 'app/pages/LiquidityMining/components/MiningPool/types';
import { BLOCKED_POOLS } from '../components/MiningPool/MiningPool.constants';

type UsePoolDepositStatusResult = {
  isBlocked: boolean;
  message?: string;
};

export function usePoolDepositStatus(
  pool: AmmLiquidityPool,
): UsePoolDepositStatusResult {
  return useMemo(() => {
    const blockedPool = BLOCKED_POOLS.find(
      (blockedPool: BlockedPoolConfig) =>
        blockedPool.assetA.toLowerCase() === pool.assetA.toLowerCase() &&
        blockedPool.chainId === currentChainId,
    );

    return {
      isBlocked: !!blockedPool,
      message: blockedPool?.message,
    };
  }, [pool.assetA]);
}

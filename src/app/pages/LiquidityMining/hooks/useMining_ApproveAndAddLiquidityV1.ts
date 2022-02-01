import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useMining_AddLiquidityV1 } from './useMining_AddLiquidityV1';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_ApproveAndAddLiquidityV1(
  pool: AmmLiquidityPool,
  reserveAmounts: string[],
  minReturn: string,
) {
  const { deposit, ...txState } = useMining_AddLiquidityV1(
    pool,
    reserveAmounts,
    minReturn,
  );
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};

      const reserveTokens = [pool.assetA, pool.assetB];

      for (let i = 0; i < reserveTokens.length; i++) {
        const asset = reserveTokens[i];
        const amount = reserveAmounts[i];
        if (asset !== Asset.RBTC) {
          tx = await contractWriter.checkAndApprove(
            asset,
            getContract('BTCWrapperProxy').address,
            amount,
          );
          if (tx.rejected) {
            return;
          }
        }
      }

      await deposit(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

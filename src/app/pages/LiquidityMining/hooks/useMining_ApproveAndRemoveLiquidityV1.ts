import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { toWei } from 'utils/blockchain/math-helpers';
import { useMining_RemoveLiquidityV1 } from './useMining_RemoveLiquidityV1';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_ApproveAndRemoveLiquidityV1(
  pool: AmmLiquidityPool,
  amount: string,
  reserveMinReturnAmounts: string[],
) {
  const { withdraw, ...txState } = useMining_RemoveLiquidityV1(
    pool,
    amount,
    reserveMinReturnAmounts,
  );

  return {
    withdraw: async () => {
      let tx: CheckAndApproveResult = {};

      tx = await contractWriter.checkAndApproveAddresses(
        pool.poolTokenA,
        getContract('BTCWrapperProxy').address,
        [amount, toWei('1000000000000000')],
        pool.converter,
      );
      if (tx.rejected) {
        return;
      }
      await withdraw(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

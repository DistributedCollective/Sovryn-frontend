import { Asset } from 'types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useMining_RemoveLiquidityV2 } from './useMining_RemoveLiquidityV2';
import { toWei } from '../../../../utils/blockchain/math-helpers';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_ApproveAndRemoveLiquidityV2(
  pool: AmmLiquidityPool,
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const { withdraw, ...txState } = useMining_RemoveLiquidityV2(
    pool,
    asset,
    amount,
    minReturn,
  );

  return {
    withdraw: async () => {
      let tx: CheckAndApproveResult = {};
      tx = await contractWriter.checkAndApproveAddresses(
        pool.getPoolTokenAddress(asset) as string,
        getContract('BTCWrapperProxy').address,
        [amount, toWei('1000000000000000000000')],
        asset,
      );
      if (tx.rejected) {
        return;
      }
      await withdraw(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useMining_AddLiquidityV2 } from './useMining_AddLiquidityV2';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_ApproveAndAddLiquidityV2(
  pool: AmmLiquidityPool,
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const { deposit, ...txState } = useMining_AddLiquidityV2(
    pool,
    asset,
    amount,
    minReturn,
  );
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};
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
      await deposit(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

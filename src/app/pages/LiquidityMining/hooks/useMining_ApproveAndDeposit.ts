import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useLiquidityMining_Deposit } from './useLiquidityMining_Deposit';
import { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_ApproveAndDeposit(
  pool: AmmLiquidityPool,
  asset: Asset,
  amount: string,
) {
  const { deposit, ...txState } = useLiquidityMining_Deposit(
    pool.getPoolTokenAddress(asset) as string,
    amount,
  );
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};

      tx = await contractWriter.checkAndApproveAddresses(
        pool.getPoolTokenAddress(asset) as string,
        getContract('liquidityMiningProxy').address,
        amount,
        asset,
      );
      if (tx.rejected) {
        return;
      }
      await deposit(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

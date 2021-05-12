import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useLiquidityMining_Deposit } from './useLiquidityMining_Deposit';
import { ContractName } from '../../../../utils/types/contracts';

export function useMining_ApproveAndDeposit(
  poolTokenContract: ContractName,
  asset: Asset,
  poolToken: string,
  amount: string,
) {
  const { deposit, ...txState } = useLiquidityMining_Deposit(poolToken, amount);
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};

      tx = await contractWriter.checkAndApproveContract(
        poolTokenContract,
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

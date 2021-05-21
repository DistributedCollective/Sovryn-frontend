import { Asset } from 'types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { toWei } from 'utils/blockchain/math-helpers';
import { useMining_RemoveLiquidityV1 } from './useMining_RemoveLiquidityV1';
import { ContractName } from 'utils/types/contracts';

export function useMining_ApproveAndRemoveLiquidityV1(
  pool: Asset,
  amount: string,
  reserveTokens: Asset[],
  reserveMinReturnAmounts: string[],
) {
  const { withdraw, ...txState } = useMining_RemoveLiquidityV1(
    pool,
    amount,
    reserveTokens,
    reserveMinReturnAmounts,
  );

  return {
    withdraw: async () => {
      let tx: CheckAndApproveResult = {};

      tx = await contractWriter.checkAndApproveContract(
        `${pool}_${pool}_poolToken` as ContractName,
        getContract('BTCWrapperProxy').address,
        [amount, toWei('1000000000000000')],
        pool,
      );
      if (tx.rejected) {
        return;
      }
      await withdraw(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

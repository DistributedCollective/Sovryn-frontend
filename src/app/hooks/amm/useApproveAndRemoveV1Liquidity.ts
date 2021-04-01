import { Asset } from 'types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { toWei } from '../../../utils/blockchain/math-helpers';
import { useRemoveV1Liquidity } from './useRemoveV1Liquidity';
import { ContractName } from '../../../utils/types/contracts';

export function useApproveAndRemoveV1Liquidity(
  pool: Asset,
  amount: string,
  reserveTokens: Asset[],
  reserveMinReturnAmounts: string[],
) {
  const { withdraw, ...txState } = useRemoveV1Liquidity(
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
        [amount, toWei('100000')],
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

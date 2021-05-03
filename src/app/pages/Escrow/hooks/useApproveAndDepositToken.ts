import { Asset } from 'types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useDepositToken } from './useDepositToken';

export function useApproveAndDepositToken(weiAmount) {
  const { deposit, ...rest } = useDepositToken(weiAmount);
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};
      tx = await contractWriter.checkAndApprove(
        Asset.SOV,
        getContract('escrowRewards').address,
        weiAmount,
      );
      if (tx.rejected) {
        return;
      }
      await deposit(tx?.nonce, tx?.approveTx);
    },
    ...rest,
  };
}

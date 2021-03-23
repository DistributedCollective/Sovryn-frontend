import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getAmmContract } from 'utils/blockchain/contract-helpers';
import { useAddV1Liquidity } from './useAddV1Liquidity';

export function useApproveAndAddV1Liquidity(
  pool: Asset,
  reserveTokens: Asset[],
  reserveAmounts: string[],
  totalSupply: string,
) {
  const { deposit, ...txState } = useAddV1Liquidity(
    pool,
    reserveTokens,
    reserveAmounts,
    totalSupply,
  );
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};

      for (let i = 0; i < reserveTokens.length; i++) {
        const asset = reserveTokens[i];
        const amount = reserveAmounts[i];
        // if (asset !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          asset,
          getAmmContract(pool).address,
          amount,
        );
        if (tx.rejected) {
          return;
        }
        // }
      }

      await deposit(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

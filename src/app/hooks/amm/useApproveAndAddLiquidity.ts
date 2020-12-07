import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getAmmContract } from 'utils/blockchain/contract-helpers';
import { useAddLiquidity } from './useAddLiquidity';

export function useApproveAndAddLiquidity(
  pool: Asset,
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const { deposit, ...txState } = useAddLiquidity(
    pool,
    asset,
    amount,
    minReturn,
  );
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};
      if (asset !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          asset,
          getAmmContract(pool).address,
          amount,
          // toWei('1000000', 'ether'),
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

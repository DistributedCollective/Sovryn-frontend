import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useLending_burn } from './useLending_burn';

export function useLending_approveAndUnlend(
  asset: Asset,
  withdrawAmount: string,
) {
  const { send: burn, ...burnTx } = useLending_burn(asset, withdrawAmount);
  return {
    unlend: async () => {
      let tx: CheckAndApproveResult = {};
      if (asset !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          asset,
          getLendingContract(asset).address,
          withdrawAmount,
        );
        if (tx.rejected) {
          return;
        }
      }
      await burn(tx?.nonce, tx?.approveTx);
    },
    ...burnTx,
  };
}

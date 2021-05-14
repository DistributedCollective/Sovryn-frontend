import { Asset } from 'types/asset';
import {
  getContract,
  getLendingContractName,
} from 'utils/blockchain/contract-helpers';
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
      if (asset !== Asset.RBTC) {
        tx = await contractWriter.checkAndApproveContract(
          getLendingContractName(asset),
          getContract('BTCWrapperProxy').address,
          withdrawAmount,
          asset,
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

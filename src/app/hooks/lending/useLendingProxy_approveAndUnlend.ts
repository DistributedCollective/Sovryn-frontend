import { Asset } from 'types/asset';
import {
  getContract,
  getLendingContractName,
} from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useLendingProxy_burn } from './useLendingProxy_burn';

export function useLendingProxy_approveAndUnlend(
  asset: Asset,
  withdrawAmount: string,
) {
  const { send: burn, ...burnTx } = useLendingProxy_burn(asset, withdrawAmount);
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

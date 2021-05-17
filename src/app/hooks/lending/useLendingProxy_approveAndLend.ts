import { Asset } from 'types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useLendingProxy_mint } from './useLendingProxy_mint';

export function useLendingProxy_approveAndLend(
  asset: Asset,
  depositAmount: string,
) {
  const { send: mint, ...mintTx } = useLendingProxy_mint(asset, depositAmount);
  return {
    lend: async () => {
      let tx: CheckAndApproveResult = {};
      if (asset !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          asset,
          getContract('BTCWrapperProxy').address,
          depositAmount,
        );
        if (tx.rejected) {
          return;
        }
      }
      await mint(tx?.nonce, tx?.approveTx);
    },
    ...mintTx,
  };
}

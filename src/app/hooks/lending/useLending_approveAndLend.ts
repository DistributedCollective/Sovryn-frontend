import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useLending_mint } from './useLending_mint';

export function useLending_approveAndLend(asset: Asset, depositAmount: string) {
  const { send: mint, ...mintTx } = useLending_mint(asset, depositAmount);
  return {
    lend: async () => {
      let tx: CheckAndApproveResult = {};
      if (asset !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          asset,
          getLendingContract(asset).address,
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

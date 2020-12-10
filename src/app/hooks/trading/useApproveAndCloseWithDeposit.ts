import { Asset } from 'types/asset';
import { useCloseWithDeposit } from './useCloseWithDeposit';
import { getContract } from '../../../utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';
import { transferAmount } from '../../../utils/blockchain/transfer-approve-amount';

export function useApproveAndCloseWithDeposit(
  borrowToken: Asset,
  collateralToken: Asset,
  loanId: string,
  receiver: string,
  repayAmount: string,
) {
  const { send, ...txState } = useCloseWithDeposit(
    borrowToken,
    loanId,
    receiver,
    repayAmount,
  );

  return {
    send: async () => {
      let tx: CheckAndApproveResult = {};
      if (borrowToken !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          borrowToken,
          getContract('sovrynProtocol').address,
          transferAmount.get(repayAmount),
        );
        if (tx.rejected) {
          return;
        }
      }
      await send(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

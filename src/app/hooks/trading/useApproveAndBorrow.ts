import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useBorrow } from './useBorrow';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';
import { newLoanId } from 'app/constants';

export function useApproveAndBorrow(
  borrowToken: Asset,
  collateralToken: Asset,
  withdrawAmount: string,
  collateralTokenSent: string,
  initialLoanDuration: string,
  // loanId,
  // loanTokenSent,
  // collateralTokenAddress,
) {
  const { borrow, ...txState } = useBorrow(
    borrowToken,
    newLoanId, //0 if new loan
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralToken,
  );

  return {
    borrow: async () => {
      let tx: CheckAndApproveResult = {};
      if (collateralToken !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          collateralToken,
          getLendingContract(borrowToken).address,
          collateralTokenSent,
        );
        if (tx.rejected) {
          return;
        }
      }
      await borrow(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}

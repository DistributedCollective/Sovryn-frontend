import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useBorrow(
  borrowToken: Asset,
  loanId,
  withdrawAmount,
  initialLoanDuration,
  collateralTokenSent,
  collateralToken: Asset,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(borrowToken),
    'borrow',
  );

  return {
    borrow: (nonce?: number, approveTx?: string | null) => {
      return send(
        [
          loanId,
          withdrawAmount,
          initialLoanDuration,
          collateralTokenSent,
          getTokenContract(collateralToken).address,
          account, // borrower
          account, // receiver
          '0x',
        ], // loanDataBytes
        {
          from: account,
          value: collateralToken === Asset.RBTC ? collateralTokenSent : '0',
          nonce,
        },
        { type: TxType.BORROW, approveTransactionHash: approveTx },
      );
    },
    ...rest,
  };
}

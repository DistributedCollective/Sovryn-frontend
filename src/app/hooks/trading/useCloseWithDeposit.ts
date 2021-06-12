import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types';
import { TxType } from '../../../store/global/transactions-store/types';

export function useCloseWithDeposit(
  asset: Asset,
  loanId,
  receiver,
  repayAmount,
) {
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'closeWithDeposit',
  );
  const account = useAccount();

  return {
    send: (nonce?: number, approveTx?: string | null) =>
      send(
        [loanId, receiver, repayAmount],
        {
          from: account,
          value: asset === Asset.RBTC ? repayAmount : '0',
          nonce,
        },
        { type: TxType.CLOSE_WITH_DEPOSIT, approveTransactionHash: approveTx },
      ),
    ...rest,
  };
}
